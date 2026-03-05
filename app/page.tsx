import React from 'react';
import RetroWindow from '../components/RetroWindow';
import AiChat from '../components/AiChat';
import SystemMonitor from '../components/SystemMonitor';

export default function Home() {
  return (
    <main className="h-screen w-screen relative overflow-hidden">
      {/* 桌面背景文字 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-white/40 text-6xl font-bold tracking-widest drop-shadow-md font-mono">
          Joey OS
        </h1>
      </div>
      
      {/* 窗口 1：个人简历 Resume.txt */}
      <RetroWindow 
        title="Resume.txt" 
        defaultX={50} 
        defaultY={50} 
        defaultWidth={420} 
        defaultHeight={450}
      >
        <div className="font-mono text-sm leading-relaxed text-black">
          {/* 头部 Heading */}
          <div className="border-b-2 border-black pb-2 mb-4">
            <h2 className="text-2xl font-bold tracking-tighter">JOEY (YEPENG) ZHU</h2>
            <p className="text-gray-600">Fullstack / Backend / DevOps Engineer</p>
            <p className="text-gray-600">📍 London, UK | ✉️ joey.yepeng@gmail.com</p>
          </div>
          
          {/* 技能摘要 */}
          <div className="mb-4">
            <h3 className="font-bold bg-black text-white inline-block px-1 mb-1">/// SKILLS & CERTS</h3>
            <p className="mt-1">
              <span className="font-bold">AWS Certified:</span> Solutions Architect - Associate<br/>
              <span className="font-bold">Stack:</span> Go, Node.js, Python, React, Next.js<br/>
              <span className="font-bold">Infra:</span> Docker, Redis, PostgreSQL, Serverless
            </p>
          </div>

          {/* 工作经历 */}
          <div className="mb-4">
            <h3 className="font-bold bg-black text-white inline-block px-1 mb-1">/// EXPERIENCE</h3>
            <div className="mt-2">
              <p className="font-bold flex justify-between">
                <span>SpinnrTech</span>
                <span className="text-xs font-normal">Present</span>
              </p>
              <p className="text-xs text-gray-600 mb-1">Backend Engineer</p>
              <ul className="list-disc pl-4 text-xs">
                <li>Building high-concurrency microservices.</li>
                <li>Optimizing API performance with Go and Lua.</li>
              </ul>
            </div>
            <div className="mt-3">
              <p className="font-bold flex justify-between">
                <span>Everbridge</span>
                <span className="text-xs font-normal">Previous</span>
              </p>
              <p className="text-xs text-gray-600 mb-1">QA Engineer</p>
              <ul className="list-disc pl-4 text-xs">
                <li>Implemented comprehensive automated testing.</li>
              </ul>
            </div>
          </div>

          {/* 教育背景 */}
          <div>
            <h3 className="font-bold bg-black text-white inline-block px-1 mb-1">/// EDUCATION</h3>
            <ul className="list-none mt-1 text-xs space-y-2">
              <li>
                <span className="font-bold">University of Nottingham</span> (2024)<br/>
                MSc Computer Science
              </li>
              <li>
                <span className="font-bold">Beijing Union University</span> (2023)<br/>
                BSc Software Engineering
              </li>
            </ul>
          </div>

        </div>
      </RetroWindow>

      {/* 窗口 2：AI 聊天大脑 */}
      <RetroWindow 
        title="AI_Joey.exe" 
        defaultX={450} 
        defaultY={100} 
        defaultWidth={350} 
        defaultHeight={450}
      >
        <AiChat />
      </RetroWindow>

      {/* 窗口 3：系统监控大屏 (我们把它装进外壳里了！) */}
      <RetroWindow 
        title="System_Monitor.exe" 
        defaultX={50} 
        defaultY={350} 
        defaultWidth={450} 
        defaultHeight={380}
      >
        <SystemMonitor />
      </RetroWindow>

    </main>
  );
}