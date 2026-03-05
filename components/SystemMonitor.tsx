"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SystemMonitor() {
  const [uptime, setUptime] = useState(0);
  const [realStats, setRealStats] = useState({ total_requests: 0, threats_blocked: 0 });
  const [isFetching, setIsFetching] = useState(false);
  
  const [pulseData, setPulseData] = useState([
    { time: '0s', ms: 210 }, { time: '5s', ms: 230 }, { time: '10s', ms: 190 },
    { time: '15s', ms: 205 }, { time: '20s', ms: 240 }, { time: '25s', ms: 220 },
  ]);

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
    }
  };

  useEffect(() => {
    fetchRealMetrics();
    
    const timer = setInterval(() => {
      setUptime(prev => prev + 1);
      setPulseData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({ 
          time: 'now', 
          ms: Math.floor(180 + Math.random() * 80) 
        });
        return newData;
      });
    }, 1000);

    const metricTimer = setInterval(fetchRealMetrics, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(metricTimer);
    };
  }, [AWS_API_URL]);

  return (
    <div className="flex flex-col h-full bg-black text-[#4ade80] font-mono text-xs p-3 overflow-hidden shadow-[inset_0px_0px_10px_rgba(74,222,128,0.2)]">
      
      <div className="flex justify-between border-b-2 border-[#4ade80] pb-2 mb-4">
        <div>
          <p>SERVER: AWS Serverless API</p>
          <p>DB: DynamoDB & Redis</p>
          <p className="animate-pulse text-red-400 mt-1">STATUS: {isFetching ? 'SYNCING...' : 'ALL SYSTEMS NOMINAL'}</p>
        </div>
        <div className="text-right">
          <p>UPTIME: {uptime}s</p>
          <p>MEM: 55MB / 128MB</p>
          <p>REGION: us-east-1</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="border border-[#4ade80] p-2 text-center relative">
          <p className="text-gray-400">Total Chats</p>
          <p className="text-2xl font-bold text-white">{realStats.total_requests}</p>
        </div>
        <div className="border border-[#4ade80] p-2 text-center">
          <p className="text-gray-400">Threats Blocked</p>
          <p className="text-2xl font-bold text-red-500">{realStats.threats_blocked}</p>
        </div>
      </div>

      <div className="flex-1 min-h-[150px] w-full">
        <p className="mb-2 text-center text-sm border-b border-gray-700 pb-1">AI Engine Pulse (ms)</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pulseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="time" hide />
            <YAxis stroke="#4ade80" fontSize={10} width={30} domain={['dataMin - 50', 'dataMax + 50']} />
            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #4ade80' }} />
            <Line 
              type="monotone" 
              dataKey="ms" 
              stroke="#4ade80" 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}