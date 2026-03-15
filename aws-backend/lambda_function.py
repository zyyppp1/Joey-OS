import json
import urllib.request
import os
import boto3
import uuid
import time
import hmac
import hashlib
from datetime import datetime

# 连接数据库
dynamodb = boto3.resource('dynamodb')
chat_table = dynamodb.Table('JoeyChatLogs')
live_table = dynamodb.Table('JoeyLiveChats') 

TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID')

def lambda_handler(event, context):
    # 解决跨域 CORS
    if event.get('httpMethod') == 'OPTIONS':
        return build_response(200, 'OK')

    try:
        body_str = event.get('body', '{}')
        body = json.loads(body_str) if body_str else {}

        # ==========================================
        # 🟢 1. 拦截 Telegram Webhook (你在手机上的回复)
        # ==========================================
        if 'message' in body and 'chat' in body['message']:
            return handle_telegram_webhook(body)

        action = body.get('action')

        # ==========================================
        # 🟢 2. 实时聊天：接收网页消息并推送到你手机
        # ==========================================
        if action == 'send_telegram':
            session_id = body.get('session_id')
            user_msg = body.get('message')
            save_live_message(session_id, 'visitor', user_msg)
            
            tg_text = f"📩 New Web Message!\nSession: {session_id}\n\nVisitor: {user_msg}"
            send_to_telegram(tg_text)
            return build_response(200, {"status": "sent"})

        # ==========================================
        # 🟢 3. 监控大屏：真实数据拉取
        # ==========================================
        if action == 'get_metrics':
            try:
                db_resp = chat_table.scan(Select='COUNT')
                total_chats = db_resp.get('Count', 0)
                blocked_count = get_redis_count('stats:total_blocked')
                return build_response(200, {
                    "total_requests": total_chats,
                    "threats_blocked": blocked_count
                })
            except Exception as e:
                print(f"Metrics Error: {e}")
                return build_response(200, {"total_requests": 0, "threats_blocked": 0})

        # ==========================================
        # 🟢 4. AI 聊天：DeepSeek 核心大脑
        # ==========================================
        user_message = body.get('message', '')
        if user_message:
            client_ip = 'unknown_ip'
            if 'requestContext' in event and 'http' in event['requestContext']:
                client_ip = event['requestContext']['http'].get('sourceIp', 'unknown_ip')
            elif 'requestContext' in event and 'identity' in event['requestContext']:
                client_ip = event['requestContext']['identity'].get('sourceIp', 'unknown_ip')

            # Redis 恶意防刷
            if not check_rate_limit(client_ip):
                return build_response(429, {"error": "Too Many Requests"})

            api_key = os.environ.get('LLM_API_KEY')
            system_prompt = """你是 Joey (Yepeng Zhu) 的专属 AI 面试助手。解答他为什么适合这份工作。
- 学历：University of Nottingham 硕士 (2024)；Beijing Union University 学士 (2023)。
- 现任：SpinnrTech 后端工程师。曾任：Everbridge QA。
要求：自信、专业、简短。"""
            
            api_url = 'https://api.deepseek.com/chat/completions'
            payload = {
                "model": "deepseek-chat",
                "messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_message}],
                "max_tokens": 150, "temperature": 0.2
            }
            req = urllib.request.Request(
                api_url, data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'}
            )
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                ai_reply = result['choices'][0]['message']['content']

            # 存入 DynamoDB (AI 聊天记录)
            try:
                chat_table.put_item(Item={
                    'MessageId': str(uuid.uuid4()),
                    'Timestamp': datetime.utcnow().isoformat(),
                    'UserIP': client_ip,
                    'UserMessage': user_message,
                    'AIReply': ai_reply
                })
            except Exception as e:
                print(f"Dynamo Error: {e}")

            return build_response(200, {"reply": ai_reply})

        return build_response(400, {"error": "Unknown request"})

    except Exception as e:
        print(f"Fatal Error: {str(e)}")
        return build_response(500, {"error": "Internal Server Error"})


# ---------------- 辅助函数区 ----------------

def handle_telegram_webhook(body):
    """处理 Joey 在手机上的回复"""
    try:
        msg = body['message']
        chat_id = str(msg['chat']['id'])
        
        # 安全校验
        if chat_id != TELEGRAM_CHAT_ID:
            return build_response(200, "OK")

        if 'reply_to_message' in msg and 'text' in msg:
            joey_reply = msg['text']
            original_text = msg['reply_to_message'].get('text', '')
            
            if "Session: " in original_text:
                session_id = original_text.split("Session: ")[1].split("\n")[0].strip()
                
                # 1. 存入实时聊天表
                save_live_message(session_id, 'joey', joey_reply)
                
                # 2. 触发 Pusher WebSocket 推送给前端
                trigger_pusher(
                    channel=f"session-{session_id}",
                    event="new_message",
                    data={"sender": "joey", "text": joey_reply}
                )
    except Exception as e:
        print("Webhook Error:", e)
    
    return build_response(200, "OK")

def trigger_pusher(channel, event, data):
    """手搓 Pusher WebSocket 签名发送"""
    app_id = os.environ.get('PUSHER_APP_ID')
    key = os.environ.get('PUSHER_KEY')
    secret = os.environ.get('PUSHER_SECRET')
    cluster = os.environ.get('PUSHER_CLUSTER')
    
    if not all([app_id, key, secret, cluster]): 
        print("Missing Pusher Env Vars")
        return

    payload = {"name": event, "channels": [channel], "data": json.dumps(data)}
    body_bytes = json.dumps(payload).encode('utf-8')
    
    path = f"/apps/{app_id}/events"
    timestamp = str(int(time.time()))
    body_md5 = hashlib.md5(body_bytes).hexdigest()
    
    auth_string = f"POST\n{path}\nauth_key={key}&auth_timestamp={timestamp}&auth_version=1.0&body_md5={body_md5}"
    signature = hmac.new(secret.encode('utf-8'), auth_string.encode('utf-8'), hashlib.sha256).hexdigest()
    
    url = f"https://api-{cluster}.pusher.com{path}?auth_key={key}&auth_timestamp={timestamp}&auth_version=1.0&body_md5={body_md5}&auth_signature={signature}"
    
    try:
        req = urllib.request.Request(url, data=body_bytes, headers={'Content-Type': 'application/json'})
        urllib.request.urlopen(req)
    except Exception as e:
        print(f"Pusher HTTP Error: {e}")

def save_live_message(session_id, sender, text):
    try:
        live_table.put_item(Item={'SessionId': session_id, 'Timestamp': datetime.utcnow().isoformat(), 'Sender': sender, 'Text': text})
    except: pass

def send_to_telegram(text):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID: return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    req = urllib.request.Request(url, data=json.dumps({"chat_id": TELEGRAM_CHAT_ID, "text": text}).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try: urllib.request.urlopen(req)
    except: pass

def get_redis_count(key):
    upstash_url = os.environ.get('UPSTASH_REDIS_REST_URL')
    upstash_token = os.environ.get('UPSTASH_REDIS_REST_TOKEN')
    if not upstash_url or not upstash_token: return 0
    try:
        req = urllib.request.Request(f"{upstash_url}/get/{key}", headers={'Authorization': f'Bearer {upstash_token}'})
        with urllib.request.urlopen(req) as response:
            val = json.loads(response.read().decode('utf-8')).get('result')
            return int(val) if val else 0
    except: return 0

def check_rate_limit(ip_address):
    upstash_url = os.environ.get('UPSTASH_REDIS_REST_URL')
    upstash_token = os.environ.get('UPSTASH_REDIS_REST_TOKEN')
    if not upstash_url or not upstash_token: return True
    redis_key = f"rate_limit:{ip_address}"
    try:
        req = urllib.request.Request(f"{upstash_url}/incr/{redis_key}", headers={'Authorization': f'Bearer {upstash_token}'})
        with urllib.request.urlopen(req) as response:
            count = int(json.loads(response.read().decode('utf-8')).get('result', 0))
        if count == 1:
            urllib.request.urlopen(urllib.request.Request(f"{upstash_url}/expire/{redis_key}/3600", headers={'Authorization': f'Bearer {upstash_token}'}))
        if count > 15:
            urllib.request.urlopen(urllib.request.Request(f"{upstash_url}/incr/stats:total_blocked", headers={'Authorization': f'Bearer {upstash_token}'}))
            return False
        return True
    except: return True

def build_response(status_code, body):
    return {'statusCode': status_code, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'OPTIONS,POST'}, 'body': json.dumps(body)}