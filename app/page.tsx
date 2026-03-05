"use client";
import React, { useState } from 'react';
import RetroWindow from '../components/RetroWindow';
import AiChat from '../components/AiChat';
import SystemMonitor from '../components/SystemMonitor';
import ResumeApp from '../components/ResumeApp';
import LiveChat from '../components/LiveChat'; 

export default function Home() {
  // 管理哪些窗口是打开状态的 (默认打开简历和监控)
  const [apps, setApps] = useState({
    resume: true,
    ai: false,
    monitor: true,
    telegram: false,
    github: false,
  });

  const toggleApp = (appName: keyof typeof apps) => {
    setApps(prev => ({ ...prev, [appName]: true })); // 确保点击图标时一定是打开
  };

  const closeApp = (appName: keyof typeof apps) => {
    setApps(prev => ({ ...prev, [appName]: false }));
  };

  return (
    <main className="h-screen w-screen relative overflow-hidden bg-[#3043c1] font-mono">
      
      {/* 桌面背景大字 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className="text-white/20 text-8xl font-black tracking-widest drop-shadow-lg">JOEY_OS</h1>
      </div>

      {/* 桌面图标区域 (Desktop Icons) */}
      <div className="absolute top-4 left-4 flex flex-col gap-6 z-10">
        
        {/* 简历图标 */}
        <div className="flex flex-col items-center cursor-pointer group w-20" onDoubleClick={() => toggleApp('resume')} onClick={() => toggleApp('resume')}>
          <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-yellow-200 transition-colors">
            📄
          </div>
          <span className="mt-1 text-white bg-black px-1 text-xs text-center group-hover:bg-blue-600">Resume.pdf</span>
        </div>

        {/* AI 助手图标 */}
        <div className="flex flex-col items-center cursor-pointer group w-20" onClick={() => toggleApp('ai')}>
          <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-yellow-200 transition-colors text-2xl">
            🤖
          </div>
          <span className="mt-1 text-white bg-black px-1 text-xs text-center group-hover:bg-blue-600">AI_Joey.exe</span>
        </div>

        {/* 监控系统图标 */}
        <div className="flex flex-col items-center cursor-pointer group w-20" onClick={() => toggleApp('monitor')}>
          <div className="w-12 h-12 bg-black border-2 border-green-400 flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-gray-800 transition-colors text-xl">
            📈
          </div>
          <span className="mt-1 text-white bg-black px-1 text-xs text-center group-hover:bg-blue-600">Monitor.sys</span>
        </div>

        {/* Telegram 实时通讯图标 */}
        <div className="flex flex-col items-center cursor-pointer group w-20" onClick={() => toggleApp('telegram')}>
          <div className="w-12 h-12 bg-blue-500 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-blue-400 transition-colors text-2xl">
            ✈️
          </div>
          <span className="mt-1 text-white bg-black px-1 text-xs text-center group-hover:bg-blue-600">LiveChat.app</span>
        </div>

      </div>

      {/* ================= 渲染打开的窗口 ================= */}
      
      {apps.resume && (
        <RetroWindow title="Resume.pdf" defaultX={150} defaultY={50} defaultWidth={500} defaultHeight={550} onClose={() => closeApp('resume')}>
          <ResumeApp />
        </RetroWindow>
      )}

      {apps.ai && (
        <RetroWindow title="AI_Joey.exe" defaultX={450} defaultY={100} defaultWidth={350} defaultHeight={450} onClose={() => closeApp('ai')}>
          <AiChat />
        </RetroWindow>
      )}

      {apps.monitor && (
        <RetroWindow title="System_Monitor.exe" defaultX={680} defaultY={350} defaultWidth={450} defaultHeight={350} onClose={() => closeApp('monitor')}>
          <SystemMonitor />
        </RetroWindow>
      )}

      {/* 引入并在顶部导入 import LiveChat from '../components/LiveChat'; */}
      
      {/* 渲染真正的 Telegram 窗口 */}
      {apps.telegram && (
        <RetroWindow title="Secure_Channel_Telegram.exe" defaultX={300} defaultY={200} defaultWidth={400} defaultHeight={400} onClose={() => closeApp('telegram')}>
          <LiveChat />
        </RetroWindow>
      )}

    </main>
  );
}