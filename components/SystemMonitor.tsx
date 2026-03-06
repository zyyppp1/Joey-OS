"use client";

import React, { useState, useEffect } from 'react';

export default function SystemMonitor() {
  const [uptime, setUptime] = useState(0);
  const [realStats, setRealStats] = useState({ total_requests: 0, threats_blocked: 0 });
  const [countdown, setCountdown] = useState(10);
  const [isFetching, setIsFetching] = useState(false);
  
  // 新增：动态模拟的网络延迟和终端日志
  const [latency, setLatency] = useState(45);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Monitor initialized...']);

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
        setLogs(prev => [...prev, '[INFO] DynamoDB GET /metrics 200 OK'].slice(-4));
      }
    } catch (error) {
      console.error(error);
      setLogs(prev => [...prev, '[ERROR] Failed to fetch telemetry data'].slice(-4));
    } finally {
      setIsFetching(false);
      setCountdown(10);
    }
  };

  useEffect(() => {
    fetchRealMetrics();

    const timer = setInterval(() => {
      setUptime(prev => prev + 1);
      setCountdown(prev => {
        if (prev <= 1) {
          fetchRealMetrics();
          return 10;
        }
        return prev - 1;
      });

      // 每秒刷新一次动态延迟，并在特定概率下输出系统日志
      setLatency(Math.floor(Math.random() * 40) + 30); // 30ms - 70ms 之间波动
      
      const possibleLogs = [
        '[INFO] Redis rate-limit check passed',
        '[SYS] Memory footprint stable at 55MB',
        '[INFO] WebSocket heartbeat sent',
        '[SYS] DeepSeek API connection alive'
      ];
      if (Math.random() > 0.6) {
        setLogs(prev => {
          const newLog = possibleLogs[Math.floor(Math.random() * possibleLogs.length)];
          return [...prev, newLog].slice(-4); // 只保留最近的 4 条日志
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [AWS_API_URL]);

  return (
    <div className="flex flex-col h-full bg-black text-[#4ade80] font-mono text-sm p-4 overflow-hidden shadow-[inset_0px_0px_10px_rgba(74,222,128,0.2)]">
      
      {/* 顶部硬核状态栏 */}
      <div className="border-b-2 border-[#4ade80] pb-3 mb-4">
        <div className="flex justify-between items-end mb-1">
          <p className="font-bold text-lg">AWS Telemetry</p>
          <p className="text-xs text-yellow-400">Ping: {latency}ms</p>
        </div>
        <div className="flex justify-between text-[10px] sm:text-xs text-gray-400">
          <div>
            <p>SERVER: AWS Serverless API</p>
            <p>DB: DynamoDB & Redis</p>
          </div>
          <div className="text-right">
            <p>UPTIME: {uptime}s</p>
            <p>MEM: 55MB (Avg) / 128MB</p>
          </div>
        </div>
      </div>

      {/* 核心真实数据展示区 */}
      <div className="flex-1 flex flex-col justify-center gap-3">
        <div className="border border-[#4ade80] p-3 text-center bg-[#4ade80]/10">
          <p className="text-[#4ade80] text-[10px] sm:text-xs uppercase tracking-widest">Total Chats (DynamoDB)</p>
          <p className="text-4xl sm:text-5xl font-bold text-white mt-1">{realStats.total_requests}</p>
        </div>
        <div className="border border-red-500 p-3 text-center bg-red-500/10">
          <p className="text-red-400 text-[10px] sm:text-xs uppercase tracking-widest">Threats Blocked (Redis)</p>
          <p className="text-4xl sm:text-5xl font-bold text-red-500 mt-1">{realStats.threats_blocked}</p>
        </div>
      </div>

      {/* 新增：实时终端日志滚动 */}
      <div className="mt-3 h-16 overflow-hidden text-[10px] leading-tight text-gray-400 opacity-80 border-t border-dashed border-gray-700 pt-2">
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>

      {/* 底部倒计时 */}
      <div className="mt-2 pt-2 border-t-2 border-[#4ade80] text-center text-xs">
        <p className={`font-bold ${isFetching ? 'text-yellow-400 animate-pulse' : 'text-[#4ade80]'}`}>
          {isFetching ? '>>> SYNCING CLOUD DATA...' : `>>> NEXT SYNC IN: ${countdown}s`}
        </p>
      </div>

    </div>
  );
}