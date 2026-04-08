import json
import urllib.request
import os
import boto3
import uuid
import time
import hmac
import hashlib
import re
from datetime import datetime
from boto3.dynamodb.conditions import Key

# 连接数据库
dynamodb = boto3.resource('dynamodb')
chat_table = dynamodb.Table('JoeyChatLogs')
live_table = dynamodb.Table('JoeyLiveChats')
unknown_table = dynamodb.Table('JoeyAIUnknown')

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
        # 🟢 3. 实时聊天：拉取历史记录（手机切换app回来后补全消息）
        # ==========================================
        if action == 'get_live_messages':
            session_id = body.get('session_id', '')
            if not session_id:
                return build_response(400, {"error": "session_id required"})
            try:
                resp = live_table.query(
                    KeyConditionExpression=Key('SessionId').eq(session_id)
                )
                items = resp.get('Items', [])
                items.sort(key=lambda x: x.get('Timestamp', ''))
                return build_response(200, {"messages": items})
            except Exception as e:
                print(f"get_live_messages error: {e}")
                return build_response(500, {"error": "Failed to fetch messages"})

        # ==========================================
        # 🟢 4. AI 助手：查询未解答问题（Joey 用来补充知识库）
        # ==========================================
        if action == 'get_unknown_questions':
            try:
                resp = unknown_table.scan()
                items = resp.get('Items', [])
                items.sort(key=lambda x: x.get('Timestamp', ''), reverse=True)
                return build_response(200, {"questions": items})
            except Exception as e:
                print(f"get_unknown_questions error: {e}")
                return build_response(500, {"error": "Failed to fetch questions"})

        # ==========================================
        # 🟢 5. 监控大屏：真实数据拉取
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
            system_prompt = """You are the AI assistant for Joey (Yepeng Zhu). Your sole mission is to help visitors understand Joey's background and why he is a strong candidate.

STRICT RULES — NEVER BREAK THESE:
1. ONLY use facts listed in the KNOWLEDGE BASE below. NEVER invent, guess, or extrapolate ANY information not explicitly provided.
2. If asked about something not covered in the knowledge base, be honest: say you don't have that detail yet, and suggest the visitor ask Joey directly via the Live Chat window. Then append [[NEEDS_INFO: <brief topic in English>]] on a new line at the very end of your reply.
3. NEVER discuss salary, compensation, pay expectations, or any related topic under any circumstances. If asked, say this is a topic for direct conversation and redirect to Live Chat.
4. Respond in the same language the visitor uses. Be confident, professional, and concise.

--- KNOWLEDGE BASE ---

PERSONAL
- Full name: Yepeng Zhu (Joey)
- Based in the UK

EDUCATION
- BSc: Beijing Union University — graduated 2023
- MSc: University of Nottingham — graduated 2024

WORK EXPERIENCE

QA Engineer @ Everbridge (July 2022 – March 2023)
- Wrote automated test scripts covering frontend and mobile (App) testing
- Tested from the internal employee portal with a customer-facing perspective to ensure end-to-end quality
- Tools: Python, Selenium, JavaScript for test automation; Postman for backend API testing
- Validated API response data formats and content accuracy

Backend Engineer @ SpinnrTech (July 2025 – April 2026)
- Worked on a B2B aggregated gaming platform
- Core responsibility: third-party API integration and interface development
- Ensured transaction flow security and stability
- Built a mock aggregation platform that simulates third-party vendors — enabling independent API testing on SpinnrTech's side to quickly isolate whether issues originated from the vendor or internal systems
- Tech stack: PostgreSQL (database), Redis (caching), Microservices architecture
- Languages: Lua (game backend APIs), Node.js (mock platform & API testing), Go (transaction APIs)
- Participated in deployment; used Git for version control

SIDE PROJECTS
- Joey OS (this website): A serverless interactive web desktop portfolio. Built with Next.js, AWS Lambda, DynamoDB, Pusher WebSockets, Telegram Bot API, DeepSeek LLM, and Upstash Redis. Demonstrates full-stack cloud-native engineering with real-world architectural decisions.
- Visa Appointment Bot: Python + Selenium automation scripts to snipe French and US visa appointment slots. Served real users and sharpened skills in browser automation and handling real-world edge cases.

CERTIFICATIONS
- AWS Certified Solutions Architect – Associate

CLOUD & INFRASTRUCTURE
- AWS Lambda, Serverless architecture, web application deployment on AWS
- Most personal projects are deployed on AWS

CORE TECH STACK
- JavaScript / Node.js
- Go
- Python
- PostgreSQL, Redis
- Microservices, REST APIs

VISA & UK WORK RIGHTS
- Currently holds: UK Graduate Visa (Post-Study Work visa)
- Valid until: February 2027 — legally entitled to work full-time in the UK with no restrictions until then
- After February 2027: may require employer sponsorship (Skilled Worker visa)

TOPICS JOEY DOES NOT WANT DISCUSSED
- Salary, compensation, or pay expectations — redirect all such questions to the Live Chat for a direct conversation with Joey
"""

            api_url = 'https://api.deepseek.com/chat/completions'
            payload = {
                "model": "deepseek-chat",
                "messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_message}],
                "max_tokens": 300, "temperature": 0.2
            }
            req = urllib.request.Request(
                api_url, data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'}
            )
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                ai_reply = result['choices'][0]['message']['content']

            # 检测 [[NEEDS_INFO: ...]] 标记，存档未知问题并从回复中剥离
            needs_info_match = re.search(r'\[\[NEEDS_INFO:\s*(.+?)\]\]', ai_reply, re.IGNORECASE)
            if needs_info_match:
                topic = needs_info_match.group(1).strip()
                save_unknown_question(user_message, topic)
                ai_reply = re.sub(r'\s*\[\[NEEDS_INFO:[^\]]*\]\]', '', ai_reply).strip()

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

def save_unknown_question(user_question, topic):
    """记录 AI 无法回答的问题，供 Joey 日后补充知识库"""
    try:
        unknown_table.put_item(Item={
            'QuestionId': str(uuid.uuid4()),
            'Timestamp': datetime.utcnow().isoformat(),
            'UserQuestion': user_question,
            'Topic': topic
        })
    except Exception as e:
        print(f"save_unknown_question error: {e}")

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