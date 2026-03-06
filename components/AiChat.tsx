"use client";

import React, { useState, useRef, useEffect } from 'react';

// 定义聊天记录的类型
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AiChat() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Message[]>([
    { role: 'assistant', content: 'SYSTEM: DeepSeek Neural Engine Initialized.' },
    { role: 'assistant', content: 'Hi! I am Joey\'s AI Assistant. My mission is to help you understand why Joey is the perfect fit for your team. Ask me anything about his tech stack, work experience, or projects!' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ⚠️ 极其重要：把这里换成你昨天在 AWS 创建的真实 API Gateway 链接！
  const AWS_API_URL = process.env.NEXT_PUBLIC_AWS_API_URL || '';
  
  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');
    setHistory(prev => [...prev, { role: 'user', content: userText }]);
    setIsTyping(true);

    try {
      const response = await fetch(AWS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      // 拦截 Redis 的 429 限流报错
      if (response.status === 429) {
        setHistory(prev => [...prev, { role: 'assistant', content: '[系统警告] 请求过于频繁！请喝杯茶，稍后再试。' }]);
        setIsTyping(false);
        return;
      }

      if (!response.ok) throw new Error('API Request Failed');

      const data = await response.json();
      setHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);

    } catch (error) {
      console.error(error);
      setHistory(prev => [...prev, { role: 'assistant', content: '[系统错误] 无法连接到云端神经引擎，请检查网络。' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full font-mono text-sm">
      {/* 聊天记录展示区 */}
      <div className="flex-1 overflow-y-auto bg-white border-2 border-black p-2 mb-2 shadow-[inset_2px_2px_0px_rgba(0,0,0,0.2)]">
        {history.map((msg, index) => (
          <div key={index} className="mb-3 leading-tight">
            <span className={msg.role === 'user' ? 'text-blue-700 font-bold' : 'text-green-700 font-bold'}>
              {msg.role === 'user' ? 'Guest:~$ ' : 'Joey_AI:~$ '}
            </span>
            <span className="text-black break-words">{msg.content}</span>
          </div>
        ))}
        
        {/* 打字机动画效果 */}
        {isTyping && (
          <div className="mb-2 text-green-700 font-bold">
            Joey_AI:~$ <span className="animate-pulse">██████_</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 复古输入框和发送按钮 */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入指令..."
          className="flex-1 border-2 border-black px-2 py-1 outline-none focus:bg-yellow-100 transition-colors shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)]"
          autoFocus
        />
        <button 
          type="submit"
          disabled={isTyping}
          className="px-4 py-1 border-2 border-black bg-gray-200 font-bold hover:bg-black hover:text-white active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
        >
          SEND
        </button>
      </form>
    </div>
  );
}