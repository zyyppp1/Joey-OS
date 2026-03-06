"use client";

import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';

type ChatMessage = {
  sender: 'visitor' | 'joey';
  text: string;
};

// 💡 关键修改 1：模块级变量，页面刷新才重置，关闭窗口不重置！
let globalSessionId = '';

export default function LiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'joey', text: 'System Initialized. Awaiting your ping...' }
  ]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const AWS_API_URL = process.env.NEXT_PUBLIC_AWS_API_URL || '';

  useEffect(() => {
    // 💡 关键修改 2：如果全局 ID 是空的，才生成新的；否则复用之前的！
    if (!globalSessionId) {
      globalSessionId = Math.random().toString(36).substring(2, 10);
    }
    setSessionId(globalSessionId);

    // 初始化 Pusher 长连接
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
    });

    const channel = pusher.subscribe(`session-${globalSessionId}`);
    
    channel.bind('new_message', function (data: ChatMessage) {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'visitor', text: userText }]);
    setIsSending(true);

    try {
      await fetch(AWS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'send_telegram', 
          session_id: sessionId, 
          message: userText 
        })
      });
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'joey', text: '[ERR] Connection to Telegram failed.' }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-[#4ade80] font-mono text-sm border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
      
      {/* 头部状态 */}
      <div className="bg-blue-600 text-white font-bold p-2 text-center uppercase tracking-widest text-xs flex justify-between">
        <span>● SECURE COMMS LINK</span>
        <span>ID: {sessionId.toUpperCase()}</span>
      </div>

      {/* 聊天记录 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'visitor' ? 'text-right' : 'text-left'}>
            <span className={`inline-block px-3 py-1 ${msg.sender === 'visitor' ? 'bg-[#4ade80] text-black' : 'border border-[#4ade80]'}`}>
              {msg.sender === 'joey' ? 'Joey: ' : 'You: '} {msg.text}
            </span>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* 输入框 */}
      <form onSubmit={handleSend} className="border-t-2 border-blue-500 flex p-2 bg-gray-900">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ping Joey's phone..."
          className="flex-1 bg-transparent outline-none text-white px-2 placeholder-gray-500"
          autoFocus
        />
        <button type="submit" disabled={isSending} className="bg-blue-600 text-white px-4 py-1 font-bold hover:bg-blue-500 disabled:opacity-50">
          SEND
        </button>
      </form>
    </div>
  );
}