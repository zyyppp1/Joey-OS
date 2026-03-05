"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// 模拟的 API 延迟数据
const initialLatencyData = [
  { time: '12:00', ms: 320 },
  { time: '12:05', ms: 450 },
  { time: '12:10', ms: 310 },
  { time: '12:15', ms: 890 }, // 模拟一次冷启动
  { time: '12:20', ms: 280 },
  { time: '12:25', ms: 305 },
];

export default function SystemMonitor() {
  const [latencyData, setLatencyData] = useState(initialLatencyData);
  const [uptime, setUptime] = useState(0);

  // 模拟运行时钟
  useEffect(() => {
    const timer = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-black text-[#4ade80] font-mono text-xs p-3 overflow-hidden shadow-[inset_0px_0px_10px_rgba(74,222,128,0.2)]">
      
      {/* 顶部状态栏 */}
      <div className="flex justify-between border-b-2 border-[#4ade80] pb-2 mb-4">
        <div>
          <p>SERVER: AWS Lambda (us-east-1)</p>
          <p>DB: DynamoDB & Upstash Redis</p>
          <p className="animate-pulse text-red-400 mt-1">STATUS: ALL SYSTEMS NOMINAL</p>
        </div>
        <div className="text-right">
          <p>UPTIME: {uptime}s</p>
          <p>MEM: 55MB / 128MB</p>
          <p>CPU: 12%</p>
        </div>
      </div>

      {/* 核心指标看板 */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="border border-[#4ade80] p-2 text-center">
          <p className="text-gray-400">Total Requests</p>
          <p className="text-xl font-bold">1,024</p>
        </div>
        <div className="border border-[#4ade80] p-2 text-center">
          <p className="text-gray-400">Threats Blocked</p>
          <p className="text-xl font-bold text-red-500">42</p>
        </div>
      </div>

      {/* 延迟折线图 */}
      <div className="flex-1 min-h-[150px] w-full">
        <p className="mb-2 text-center text-sm border-b border-gray-700 pb-1">AI Engine Latency (ms)</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={latencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="time" stroke="#4ade80" fontSize={10} tickMargin={5} />
            <YAxis stroke="#4ade80" fontSize={10} width={30} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid #4ade80', color: '#4ade80' }}
              itemStyle={{ color: '#4ade80' }}
            />
            <Line 
              type="stepAfter" 
              dataKey="ms" 
              stroke="#4ade80" 
              strokeWidth={2} 
              dot={{ r: 3, fill: '#000', stroke: '#4ade80' }} 
              activeDot={{ r: 5, fill: '#4ade80' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}