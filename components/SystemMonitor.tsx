"use client";

import React, { useState, useEffect } from 'react';

export default function SystemMonitor() {
  const [uptime, setUptime] = useState(0);
  const [realStats, setRealStats] = useState({ total_requests: 0, threats_blocked: 0 });
  const [countdown, setCountdown] = useState(10); // 10秒倒计时
  const [isFetching, setIsFetching] = useState(false);

  const AWS_API_URL = process.env.NEXT_PUBLIC_AWS_API_URL || '';

  const fetchRealMetrics = async () => {
    if (!AWS_API_URL) return;
    setIsFetching(true);
    try {
      const response = await fetch(AWS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_metrics' })
      });
      if (response.ok) {
        const data = await response.json();
        setRealStats({
          total_requests: data.total_requests || 0,
          threats_blocked: data.threats_blocked || 0
        });
      }
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    } finally {
      setIsFetching(false);
      setCountdown(10); // 数据拉取完成后，重置倒计时
    }
  };

  useEffect(() => {
    fetchRealMetrics(); // 初始拉取

    const timer = setInterval(() => {
      setUptime(prev => prev + 1);
      setCountdown(prev => {
        if (prev <= 1) {
          fetchRealMetrics(); // 倒计时结束，触发拉取
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [AWS_API_URL]);

  return (
    <div className="flex flex-col h-full bg-black text-[#4ade80] font-mono text-sm p-4 overflow-hidden shadow-[inset_0px_0px_10px_rgba(74,222,128,0.2)]">
      
      {/* 顶部硬核状态栏 */}
      <div className="border-b-2 border-[#4ade80] pb-3 mb-4">
        <p className="font-bold text-lg mb-1">AWS Telemetry</p>
        <div className="flex justify-between text-xs text-gray-400">
          <div>
            <p>SERVER: AWS Serverless API</p>
            <p>DB: DynamoDB & Redis</p>
            <p>REGION: us-east-1</p>
          </div>
          <div className="text-right">
            <p>UPTIME: {uptime}s</p>
            <p>MEM: 55MB (Avg) / 128MB</p>
          </div>
        </div>
      </div>

      {/* 核心真实数据展示区 */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        <div className="border border-[#4ade80] p-4 text-center relative bg-[#4ade80]/10">
          <p className="text-[#4ade80] text-xs uppercase tracking-widest">Total Chats (DynamoDB)</p>
          <p className="text-3xl md:text-5xl font-bold text-white mt-2">{realStats.total_requests}</p>
        </div>
        <div className="border border-red-500 p-4 text-center bg-red-500/10">
          <p className="text-red-400 text-xs uppercase tracking-widest">Threats Blocked (Redis)</p>
          <p className="text-3xl md:text-5xl font-bold text-red-500 mt-2">{realStats.threats_blocked}</p>
        </div>
      </div>

      {/* 底部倒计时 */}
      <div className="mt-4 pt-3 border-t-2 border-[#4ade80] text-center">
        <p className={`font-bold ${isFetching ? 'text-yellow-400 animate-pulse' : 'text-[#4ade80]'}`}>
          {isFetching ? '>>> SYNCING CLOUD DATA...' : `>>> NEXT SYNC IN: ${countdown}s`}
        </p>
      </div>

    </div>
  );
}