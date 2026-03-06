"use client";
import React, { useState, useEffect } from 'react';
import RetroWindow from '../components/RetroWindow';
import AiChat from '../components/AiChat';
import SystemMonitor from '../components/SystemMonitor';
import ResumeApp from '../components/ResumeApp';
import LiveChat from '../components/LiveChat';
import BlogApp from '../components/BlogApp';

type AppState = { open: boolean; minimized: boolean };

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeWindow, setActiveWindow] = useState<string>('resume'); // 控制窗口层级

  // 默认直接打开简历、AI、监控和LiveChat
  const [apps, setApps] = useState<Record<string, AppState>>({
    resume: { open: true, minimized: false },
    ai: { open: true, minimized: false },
    monitor: { open: true, minimized: false },
    telegram: { open: true, minimized: false }, // <--- 这里改成 true
    blog: { open: false, minimized: false }, // <--- 新增这行
  });

  // 初始化：检测屏幕尺寸，防止 SSR 水合报错
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      const isMob = window.innerWidth < 768;
      setIsMobile(isMob);
      
      // 💡 移动端核心优化：如果是手机屏幕，强制把所有窗口设为“关闭”状态
      if (isMob) {
        setApps(prev => {
          const closedApps = { ...prev };
          Object.keys(closedApps).forEach(key => {
            closedApps[key].open = false;
          });
          return closedApps;
        });
      }
    };
    
    checkMobile(); // 首次运行检测
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
      // 移动端：宽度占满90%，居中，稍微错开Y轴（安全隔离，不动它）
      const width = window.innerWidth * 0.9;
      const height = window.innerHeight * 0.7;
      const offset = Object.keys(apps).indexOf(appName) * 20;
      return { defaultX: window.innerWidth * 0.05, defaultY: 40 + offset, defaultWidth: width, defaultHeight: height };
    }
    
    // 🖥️ 电脑端：终极并排布局 (Side-by-side Command Center)
    // 假设常见的 1920x1080 / 1440x900 屏幕，统一 Y 轴为 40，X 轴依次递增排列
    switch(appName) {
      case 'resume': 
        // 最左边，避开桌面图标 (X: 100)
        return { defaultX: 100, defaultY: 40, defaultWidth: 480, defaultHeight: 850 };
      case 'ai': 
        // 紧贴简历右侧 (X: 100 + 480 + 20间距 = 600)
        return { defaultX: 600, defaultY: 40, defaultWidth: 350, defaultHeight: 500 };
      case 'telegram': 
        // 紧贴 AI 右侧 (X: 600 + 350 + 20间距 = 970)
        return { defaultX: 970, defaultY: 40, defaultWidth: 360, defaultHeight: 500 };
      case 'monitor': 
        // 最右侧，紧贴 Telegram (X: 970 + 360 + 20间距 = 1350)
        return { defaultX: 1350, defaultY: 40, defaultWidth: 420, defaultHeight: 500 };
      // 3. 为 Blog 窗口设定位置 (居中偏右)
      case 'blog': return { defaultX: 400, defaultY: 150, defaultWidth: 700, defaultHeight: 500 };
      default: 
        return { defaultX: 50, defaultY: 50, defaultWidth: 400, defaultHeight: 300 };
    }
  };

  if (!isMounted) return null; // 确保在拿到屏幕尺寸后再渲染窗口

  return (
    <main className="h-screen w-screen relative overflow-hidden bg-[#6f80eb] font-mono">
      
      {/* 桌面背景 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className="text-white/20 text-5xl md:text-8xl font-black tracking-widest drop-shadow-lg text-center">Joey</h1>
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

        <div className="flex flex-col items-center cursor-pointer group w-16 md:w-20" onClick={() => openOrRestoreApp('blog')}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-yellow-200 transition-colors text-xl">
            📝
          </div>
          <span className="mt-1 text-white bg-black px-1 text-[10px] md:text-xs text-center group-hover:bg-blue-600">Blogs.exe</span>
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
        <RetroWindow title="LiveChat.exe" {...getWindowConfig('telegram')} // <--- 把这里的 title 改成 LiveChat.exe
          isMinimized={apps.telegram.minimized} onMinimize={() => minimizeApp('telegram')} onClose={() => closeApp('telegram')}
          onClickWindow={() => bringToFront('telegram')} zIndex={activeWindow === 'telegram' ? 50 : 10}>
          <LiveChat />
        </RetroWindow>
      )}

      {/* 5. 渲染 Blog 窗口 */}
      {apps.blog.open && (
        <RetroWindow title="Blog_Reader.exe" {...getWindowConfig('blog')}
          isMinimized={apps.blog.minimized} onMinimize={() => minimizeApp('blog')} onClose={() => closeApp('blog')}
          onClickWindow={() => bringToFront('blog')} zIndex={activeWindow === 'blog' ? 50 : 10}>
          <BlogApp />
        </RetroWindow>
      )}

    </main>
  );
}