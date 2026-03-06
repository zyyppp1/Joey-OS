"use client";
import React, { useState } from 'react';
import RetroWindow from '../components/RetroWindow';
import AiChat from '../components/AiChat';
import SystemMonitor from '../components/SystemMonitor';
import ResumeApp from '../components/ResumeApp';
import LiveChat from '../components/LiveChat';

// 定义每个 App 的状态
type AppState = { open: boolean; minimized: boolean };

export default function Home() {
  // 💡 默认直接打开简历、AI、和监控
  const [apps, setApps] = useState<Record<string, AppState>>({
    resume: { open: true, minimized: false },
    ai: { open: true, minimized: false },
    monitor: { open: true, minimized: false },
    telegram: { open: false, minimized: false },
  });

  // 点击桌面图标：如果没有打开则打开；如果被最小化了则恢复！
  const openOrRestoreApp = (appName: string) => {
    setApps(prev => ({
      ...prev,
      [appName]: { open: true, minimized: false }
    }));
  };

  const minimizeApp = (appName: string) => {
    setApps(prev => ({
      ...prev,
      [appName]: { ...prev[appName], minimized: true }
    }));
  };

  const closeApp = (appName: string) => {
    setApps(prev => ({
      ...prev,
      [appName]: { ...prev[appName], open: false }
    }));
  };

  return (
    <main className="h-screen w-screen relative overflow-hidden bg-[#008080] font-mono">
      
      {/* 桌面背景 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className="text-white/20 text-8xl font-black tracking-widest drop-shadow-lg">JOEY_OS</h1>
      </div>

      {/* 桌面图标区域 (调用 openOrRestoreApp) */}
      <div className="absolute top-4 left-4 flex flex-col gap-6 z-10">
        <div className="flex flex-col items-center cursor-pointer group w-20" onDoubleClick={() => openOrRestoreApp('resume')} onClick={() => openOrRestoreApp('resume')}>
          <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-yellow-200 transition-colors">📄</div>
          <span className="mt-1 text-white bg-black px-1 text-xs text-center group-hover:bg-blue-600">Resume.pdf</span>
        </div>
        
        {/* ... (AI, Monitor, Telegram 的图标同理，把 onClick 改成 onClick={() => openOrRestoreApp('ai')} 等等) ... */}
        <div className="flex flex-col items-center cursor-pointer group w-20" onClick={() => openOrRestoreApp('ai')}>
          <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-yellow-200 transition-colors text-2xl">🤖</div>
          <span className="mt-1 text-white bg-black px-1 text-xs text-center group-hover:bg-blue-600">AI_Joey.exe</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer group w-20" onClick={() => openOrRestoreApp('monitor')}>
          <div className="w-12 h-12 bg-black border-2 border-green-400 flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-gray-800 transition-colors text-xl">📈</div>
          <span className="mt-1 text-white bg-black px-1 text-xs text-center group-hover:bg-blue-600">Monitor.sys</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer group w-20" onClick={() => openOrRestoreApp('telegram')}>
          <div className="w-12 h-12 bg-blue-500 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-blue-400 transition-colors text-2xl">✈️</div>
          <span className="mt-1 text-white bg-black px-1 text-xs text-center group-hover:bg-blue-600">LiveChat.app</span>
        </div>
      </div>

      {/* ================= 渲染窗口 ================= */}
      
      {apps.resume.open && (
        <RetroWindow title="Resume.pdf" defaultX={150} defaultY={50} defaultWidth={500} defaultHeight={550} 
          isMinimized={apps.resume.minimized} onMinimize={() => minimizeApp('resume')} onClose={() => closeApp('resume')}>
          <ResumeApp />
        </RetroWindow>
      )}

      {apps.ai.open && (
        <RetroWindow title="AI_Joey.exe" defaultX={680} defaultY={50} defaultWidth={350} defaultHeight={450} 
          isMinimized={apps.ai.minimized} onMinimize={() => minimizeApp('ai')} onClose={() => closeApp('ai')}>
          <AiChat />
        </RetroWindow>
      )}

      {apps.monitor.open && (
        <RetroWindow title="System_Monitor.exe" defaultX={680} defaultY={520} defaultWidth={450} defaultHeight={300} 
          isMinimized={apps.monitor.minimized} onMinimize={() => minimizeApp('monitor')} onClose={() => closeApp('monitor')}>
          <SystemMonitor />
        </RetroWindow>
      )}

      {apps.telegram.open && (
        <RetroWindow title="Secure_Channel_Telegram.exe" defaultX={300} defaultY={200} defaultWidth={400} defaultHeight={400} 
          isMinimized={apps.telegram.minimized} onMinimize={() => minimizeApp('telegram')} onClose={() => closeApp('telegram')}>
          <LiveChat />
        </RetroWindow>
      )}

    </main>
  );
}