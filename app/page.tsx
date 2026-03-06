"use client";
import React, { useState, useEffect } from 'react';
import RetroWindow from '../components/RetroWindow';
import AiChat from '../components/AiChat';
import SystemMonitor from '../components/SystemMonitor';
import ResumeApp from '../components/ResumeApp';
import LiveChat from '../components/LiveChat';
import BlogApp from '../components/BlogApp';
import GitHubApp from '../components/GitHubApp';
import LinkedInApp from '../components/LinkedInApp';

type AppState = { open: boolean; minimized: boolean };

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeWindow, setActiveWindow] = useState<string>('resume');
  const [uiScale, setUiScale] = useState(1); // 💡 新增：全局缩放比例

  const appEnv = process.env.NEXT_PUBLIC_APP_ENV || 'production';
  const bgClass = appEnv === 'stage' ? 'bg-[#808080]' : 'bg-[#6f80eb]';

  const [apps, setApps] = useState<Record<string, AppState>>({
    resume: { open: true, minimized: false },
    ai: { open: true, minimized: false },
    monitor: { open: true, minimized: false },
    telegram: { open: true, minimized: false },
    blog: { open: false, minimized: false },
    github: { open: false, minimized: false },
    linkedin: { open: false, minimized: false },
  });

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      const sw = window.innerWidth;
      const sh = window.innerHeight;
      const isMob = sw < 768;
      setIsMobile(isMob);
      
      if (isMob) {
        setApps(prev => {
          const closedApps = { ...prev };
          Object.keys(closedApps).forEach(key => closedApps[key].open = false);
          return closedApps;
        });
        setUiScale(1); // 手机端不需要缩放，走原生的堆叠
      } else {
        // 💡 核心：保证我们的完美虚拟尺寸是 1800x920。
        // 如果屏幕小于这个尺寸，计算缩放比例；如果屏幕大于这个尺寸，比例最高为 1。
        const scaleX = sw / 1800;
        const scaleY = sh / 920;
        setUiScale(Math.min(scaleX, scaleY, 1));
      }
    };
    
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bringToFront = (appName: string) => setActiveWindow(appName);
  const openOrRestoreApp = (appName: string) => { setApps(prev => ({ ...prev, [appName]: { open: true, minimized: false } })); bringToFront(appName); };
  const minimizeApp = (appName: string) => { setApps(prev => ({ ...prev, [appName]: { ...prev[appName], minimized: true } })); };
  const closeApp = (appName: string) => { setApps(prev => ({ ...prev, [appName]: { ...prev[appName], open: false } })); };

  // 💡 根据虚拟画布动态计算位置
  const getWindowConfig = (appName: string) => {
    if (isMobile) {
      const width = window.innerWidth * 0.9;
      const height = window.innerHeight * 0.7;
      const offset = Object.keys(apps).indexOf(appName) * 20;
      return { defaultX: window.innerWidth * 0.05, defaultY: 40 + offset, defaultWidth: width, defaultHeight: height };
    }
    
    // 获取经过缩放后的虚拟大画布宽度和高度
    const virtualWidth = window.innerWidth / uiScale;
    const virtualHeight = window.innerHeight / uiScale;

    // 所有窗口在 1800x920 尺寸下的理想定宽定高
    const w_resume = 480;
    const w_ai = 350;
    const w_telegram = 360;
    const w_monitor = 420;
    const gap = 20;
    const totalGroupWidth = w_resume + w_ai + w_telegram + w_monitor + gap * 3;

    // 如果屏幕非常大（比如你的 Mac Pro），将整个窗口组光学居中
    let startX = 120;
    if (virtualWidth > totalGroupWidth + 150) {
      startX = 120 + (virtualWidth - 120 - totalGroupWidth) / 2;
    }

    switch(appName) {
      case 'resume': return { defaultX: startX, defaultY: 40, defaultWidth: w_resume, defaultHeight: 850 };
      case 'ai': return { defaultX: startX + w_resume + gap, defaultY: 40, defaultWidth: w_ai, defaultHeight: 500 };
      case 'telegram': return { defaultX: startX + w_resume + w_ai + gap * 2, defaultY: 40, defaultWidth: w_telegram, defaultHeight: 500 };
      case 'monitor': return { defaultX: startX + w_resume + w_ai + w_telegram + gap * 3, defaultY: 40, defaultWidth: w_monitor, defaultHeight: 500 };
      
      // 博客/Github 等后来打开的窗口，按照虚拟屏幕的百分比居中
      case 'blog': return { defaultX: virtualWidth * 0.15, defaultY: virtualHeight * 0.15, defaultWidth: virtualWidth * 0.7, defaultHeight: virtualHeight * 0.7 };
      case 'github': return { defaultX: virtualWidth * 0.15, defaultY: virtualHeight * 0.15, defaultWidth: virtualWidth * 0.7, defaultHeight: virtualHeight * 0.7 };
      case 'linkedin': return { defaultX: (virtualWidth - 450) / 2, defaultY: (virtualHeight - 420) / 2, defaultWidth: 450, defaultHeight: 420 };

      default: return { defaultX: 100, defaultY: 100, defaultWidth: 400, defaultHeight: 300 };
    }
  };

  if (!isMounted) return null;

  return (
    <main className={`h-screen w-screen relative overflow-hidden ${bgClass} font-mono`}>
      
      {/* 背景大字 (不受缩放影响，始终居中) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className="text-white/20 text-5xl md:text-8xl font-black tracking-widest drop-shadow-lg text-center">
          {appEnv === 'stage' ? 'JOEY_STAGE' : 'Joey_OS'}
        </h1>
      </div>

      {/* 💡 核心魔法：将图标和窗口放进一个虚拟的大画布里，通过 CSS 等比缩小 */}
      <div 
        style={{
          transform: `scale(${uiScale})`,
          transformOrigin: 'top left',
          width: isMobile ? '100%' : `${100 / uiScale}%`,
          height: isMobile ? '100%' : `${100 / uiScale}%`,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10
        }}
      >
        {/* 桌面图标区域 */}
        <div className="absolute top-4 left-4 flex flex-col gap-6 z-[100]">
          <div className="flex flex-col items-center cursor-pointer group w-16 md:w-20 p-2" onClick={() => openOrRestoreApp('resume')}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-yellow-200 transition-colors text-xl">📄</div>
            <span className="mt-1 text-white bg-black px-1 text-[10px] md:text-xs text-center group-hover:bg-blue-600">Resume.pdf</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group w-16 md:w-20 p-2" onClick={() => openOrRestoreApp('ai')}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-yellow-200 transition-colors text-xl">🤖</div>
            <span className="mt-1 text-white bg-black px-1 text-[10px] md:text-xs text-center group-hover:bg-blue-600">AI_Joey.exe</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group w-16 md:w-20 p-2" onClick={() => openOrRestoreApp('monitor')}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black border-2 border-green-400 flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-gray-800 transition-colors text-xl">📈</div>
            <span className="mt-1 text-white bg-black px-1 text-[10px] md:text-xs text-center group-hover:bg-blue-600">Monitor.sys</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group w-16 md:w-20 p-2" onClick={() => openOrRestoreApp('telegram')}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-blue-400 transition-colors text-xl">✈️</div>
            <span className="mt-1 text-white bg-black px-1 text-[10px] md:text-xs text-center group-hover:bg-blue-600">LiveChat.app</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group w-16 md:w-20 p-2" onClick={() => openOrRestoreApp('blog')}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-yellow-200 transition-colors text-xl">📝</div>
            <span className="mt-1 text-white bg-black px-1 text-[10px] md:text-xs text-center group-hover:bg-blue-600">Blogs.exe</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group w-16 md:w-20 p-2" onClick={() => openOrRestoreApp('github')}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black border-2 border-[#4ade80] flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-gray-800 transition-colors text-xl">👨‍💻</div>
            <span className="mt-1 text-white bg-black px-1 text-[10px] md:text-xs text-center group-hover:bg-[#4ade80] group-hover:text-black">GitHub.exe</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer group w-16 md:w-20 p-2" onClick={() => openOrRestoreApp('linkedin')}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:bg-amber-400 transition-colors text-xl">🕵️‍♂️</div>
            <span className="mt-1 text-white bg-black px-1 text-[10px] md:text-xs text-center group-hover:bg-amber-500 group-hover:text-black">LinkedIn.exe</span>
          </div>
        </div>

        {/* ================= 渲染窗口，务必传入 scale={uiScale} ================= */}
        {apps.resume.open && (
          <RetroWindow title="Resume.pdf" {...getWindowConfig('resume')} scale={uiScale}
            isMinimized={apps.resume.minimized} onMinimize={() => minimizeApp('resume')} onClose={() => closeApp('resume')} onClickWindow={() => bringToFront('resume')} zIndex={activeWindow === 'resume' ? 50 : 10}>
            <ResumeApp />
          </RetroWindow>
        )}
        {apps.ai.open && (
          <RetroWindow title="AI_Joey.exe" {...getWindowConfig('ai')} scale={uiScale}
            isMinimized={apps.ai.minimized} onMinimize={() => minimizeApp('ai')} onClose={() => closeApp('ai')} onClickWindow={() => bringToFront('ai')} zIndex={activeWindow === 'ai' ? 50 : 10}>
            <AiChat />
          </RetroWindow>
        )}
        {apps.monitor.open && (
          <RetroWindow title="System_Monitor.exe" {...getWindowConfig('monitor')} scale={uiScale}
            isMinimized={apps.monitor.minimized} onMinimize={() => minimizeApp('monitor')} onClose={() => closeApp('monitor')} onClickWindow={() => bringToFront('monitor')} zIndex={activeWindow === 'monitor' ? 50 : 10}>
            <SystemMonitor />
          </RetroWindow>
        )}
        {apps.telegram.open && (
          <RetroWindow title="LiveChat.exe" {...getWindowConfig('telegram')} scale={uiScale}
            isMinimized={apps.telegram.minimized} onMinimize={() => minimizeApp('telegram')} onClose={() => closeApp('telegram')} onClickWindow={() => bringToFront('telegram')} zIndex={activeWindow === 'telegram' ? 50 : 10}>
            <LiveChat />
          </RetroWindow>
        )}
        {apps.blog.open && (
          <RetroWindow title="Blog_Reader.exe" {...getWindowConfig('blog')} scale={uiScale}
            isMinimized={apps.blog.minimized} onMinimize={() => minimizeApp('blog')} onClose={() => closeApp('blog')} onClickWindow={() => bringToFront('blog')} zIndex={activeWindow === 'blog' ? 50 : 10}>
            <BlogApp />
          </RetroWindow>
        )}
        {apps.github.open && (
          <RetroWindow title="GitHub_Terminal.exe" {...getWindowConfig('github')} scale={uiScale}
            isMinimized={apps.github.minimized} onMinimize={() => minimizeApp('github')} onClose={() => closeApp('github')} onClickWindow={() => bringToFront('github')} zIndex={activeWindow === 'github' ? 50 : 10}>
            <GitHubApp />
          </RetroWindow>
        )}
        {apps.linkedin.open && (
          <RetroWindow title="Agent_Profile_LNKD.sys" {...getWindowConfig('linkedin')} scale={uiScale}
            isMinimized={apps.linkedin.minimized} onMinimize={() => minimizeApp('linkedin')} onClose={() => closeApp('linkedin')} onClickWindow={() => bringToFront('linkedin')} zIndex={activeWindow === 'linkedin' ? 50 : 10}>
            <LinkedInApp />
          </RetroWindow>
        )}
      </div>
    </main>
  );
}