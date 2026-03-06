"use client";
import React, { useState, useEffect } from 'react';
import RetroWindow from '../components/RetroWindow';
import AiChat from '../components/AiChat';
import SystemMonitor from '../components/SystemMonitor';
import ResumeApp from '../components/ResumeApp';
import LiveChat from '../components/LiveChat';

type AppState = { open: boolean; minimized: boolean };

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeWindow, setActiveWindow] = useState<string>('resume'); // 控制窗口层级

  // 默认直接打开简历、AI、和监控
  const [apps, setApps] = useState<Record<string, AppState>>({
    resume: { open: true, minimized: false },
    ai: { open: true, minimized: false },
    monitor: { open: true, minimized: false },
    telegram: { open: false, minimized: false },
  });

  // 初始化：检测屏幕尺寸，防止 SSR 水合报错
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const bringToFront = (appName: string) => setActiveWindow(appName);

  const openOrRestoreApp = (appName: string) => {
    setApps(prev => ({ ...prev, [appName]: { open: true, minimized: false } }));
    bringToFront(appName);
  };

  const minimizeApp = (appName: string) => {
    setApps(prev => ({ ...prev, [appName]: { ...prev[appName], minimized: true } }));
  };

  const closeApp = (appName: string) => {
    setApps(prev => ({ ...prev, [appName]: { ...prev[appName], open: false } }));
  };

  // 根据设备动态计算窗口的初始位置和大小
  // 根据设备动态计算窗口的初始位置和大小
  const getWindowConfig = (appName: string) => {
    if (isMobile) {
      // 移动端：宽度占满90%，居中，稍微错开Y轴
      const width = window.innerWidth * 0.9;
      const height = window.innerHeight * 0.7;
      const offset = Object.keys(apps).indexOf(appName) * 20;
      return { defaultX: window.innerWidth * 0.05, defaultY: 40 + offset, defaultWidth: width, defaultHeight: height };
    }
    
    // 桌面端：调整到“刚刚好完全展示内容”的完美比例！
    switch(appName) {
      case 'resume': 
        // 宽度稍微加宽到 520，高度加高到 780，刚好能吃下所有的经历和证书
        return { defaultX: 100, defaultY: 40, defaultWidth: 520, defaultHeight: 780 };
      case 'ai': 
        return { defaultX: 640, defaultY: 40, defaultWidth: 360, defaultHeight: 480 };
      case 'monitor': 
        // 高度加高到 360，让大数字和边框有充足的呼吸感
        return { defaultX: 640, defaultY: 540, defaultWidth: 450, defaultHeight: 360 };
      case 'telegram': 
        return { defaultX: 300, defaultY: 200, defaultWidth: 400, defaultHeight: 450 };
      default: 
        return { defaultX: 50, defaultY: 50, defaultWidth: 400, defaultHeight: 300 };
    }
  };

  if (!isMounted) return null; // 确保在拿到屏幕尺寸后再渲染窗口

  return (
    <main className="h-screen w-screen relative overflow-hidden bg-[#008080] font-mono">
      
      {/* 桌面背景 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className="text-white/20 text-5xl md:text-8xl font-black tracking-widest drop-shadow-lg text-center">JOEY_OS</h1>
      </div>

      {/* 桌面图标区域 */}
      <div className="absolute top-4 left-4 flex flex-col gap-6 z-[100]">
        <div className="flex flex-col items-center cursor-pointer group w-16 md:w-20" onClick={() => openOrRestoreApp('resume')}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-yellow-200 transition-colors text-xl">📄</div>
          <span className="mt-1 text-white bg-black px-1 text-[10px] md:text-xs text-center group-hover:bg-blue-600">Resume.pdf</span>
        </div>
        
        <div className="flex flex-col items-center cursor-pointer group w-16 md:w-20" onClick={() => openOrRestoreApp('ai')}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-yellow-200 transition-colors text-xl">🤖</div>
          <span className="mt-1 text-white bg-black px-1 text-[10px] md:text-xs text-center group-hover:bg-blue-600">AI_Joey.exe</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer group w-16 md:w-20" onClick={() => openOrRestoreApp('monitor')}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-black border-2 border-green-400 flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-gray-800 transition-colors text-xl">📈</div>
          <span className="mt-1 text-white bg-black px-1 text-[10px] md:text-xs text-center group-hover:bg-blue-600">Monitor.sys</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer group w-16 md:w-20" onClick={() => openOrRestoreApp('telegram')}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-blue-400 transition-colors text-xl">✈️</div>
          <span className="mt-1 text-white bg-black px-1 text-[10px] md:text-xs text-center group-hover:bg-blue-600">LiveChat.app</span>
        </div>
      </div>

      {/* ================= 渲染窗口 ================= */}
      
      {apps.resume.open && (
        <RetroWindow title="Resume.pdf" {...getWindowConfig('resume')}
          isMinimized={apps.resume.minimized} onMinimize={() => minimizeApp('resume')} onClose={() => closeApp('resume')}
          onClickWindow={() => bringToFront('resume')} zIndex={activeWindow === 'resume' ? 50 : 10}>
          <ResumeApp />
        </RetroWindow>
      )}

      {apps.ai.open && (
        <RetroWindow title="AI_Joey.exe" {...getWindowConfig('ai')}
          isMinimized={apps.ai.minimized} onMinimize={() => minimizeApp('ai')} onClose={() => closeApp('ai')}
          onClickWindow={() => bringToFront('ai')} zIndex={activeWindow === 'ai' ? 50 : 10}>
          <AiChat />
        </RetroWindow>
      )}

      {apps.monitor.open && (
        <RetroWindow title="System_Monitor.exe" {...getWindowConfig('monitor')}
          isMinimized={apps.monitor.minimized} onMinimize={() => minimizeApp('monitor')} onClose={() => closeApp('monitor')}
          onClickWindow={() => bringToFront('monitor')} zIndex={activeWindow === 'monitor' ? 50 : 10}>
          <SystemMonitor />
        </RetroWindow>
      )}

      {apps.telegram.open && (
        <RetroWindow title="Secure_Channel_Telegram.exe" {...getWindowConfig('telegram')}
          isMinimized={apps.telegram.minimized} onMinimize={() => minimizeApp('telegram')} onClose={() => closeApp('telegram')}
          onClickWindow={() => bringToFront('telegram')} zIndex={activeWindow === 'telegram' ? 50 : 10}>
          <LiveChat />
        </RetroWindow>
      )}

    </main>
  );
}