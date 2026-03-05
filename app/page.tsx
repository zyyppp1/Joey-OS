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
      
      {/* 窗口 1：个人详细简历 (包含超链接) */}
      <RetroWindow 
        title="Resume.txt" 
        defaultX={40} 
        defaultY={40} 
        defaultWidth={460} 
        defaultHeight={550}
      >
        <div className="font-mono text-sm leading-relaxed text-black">
          
          {/* Header 区域 */}
          <div className="border-b-2 border-black pb-3 mb-4">
            <h2 className="text-3xl font-black tracking-tighter">JOEY (YEPENG) ZHU</h2>
            <p className="text-gray-700 font-bold mt-1">Fullstack / Backend / DevOps Engineer</p>
            <div className="mt-2 flex flex-wrap gap-3 text-blue-700 font-bold">
              {/* 请把 href 里的 # 换成你真实的链接 */}
              <a href="https://github.com/zyyppp1" target="_blank" className="hover:bg-blue-700 hover:text-white underline">🔗 GitHub</a>
              <a href="https://www.linkedin.com/in/yepeng-zhu-9b0021314/" target="_blank" className="hover:bg-blue-700 hover:text-white underline">🔗 LinkedIn</a>
              <a href="mailto:joey.yepeng@gmail.com" className="hover:bg-blue-700 hover:text-white underline">✉️ Email</a>
            </div>
          </div>
          
          {/* About Me */}
          <div className="mb-4">
            <p className="italic text-gray-700">
              "A passionate Full Stack Software Developer 🚀 2024 Graduate in London, earned £2000+ with self-made scripts in two weeks. Hands-on experiences in both frontend and backend. (🤫 If you want to know the top 10 Chinese restaurants in London, reach out to me!)"
            </p>
          </div>

          {/* 经历 Experiences */}
          <div className="mb-4">
            <h3 className="font-bold bg-black text-white inline-block px-2 mb-2">/// EXPERIENCES</h3>
            
            <div className="mb-3">
              <p className="font-bold flex justify-between bg-gray-200 px-1">
                <span>SpinnrTech - Backend Engineer</span>
                <span>Jul 2025 - Present</span>
              </p>
              <ul className="list-disc pl-5 mt-1 text-xs space-y-1">
                <li>Developed secure, high-performance RESTful APIs & microservices using Node.js, Go, and Lua.</li>
                <li>Implemented comprehensive logging, error handling, and monitoring (Observability).</li>
              </ul>
            </div>

            <div className="mb-3">
              <p className="font-bold flex justify-between bg-gray-200 px-1">
                <span>Everbridge - QA Engineer (SDET)</span>
                <span>Jul 2022 - Mar 2023</span>
              </p>
              <ul className="list-disc pl-5 mt-1 text-xs space-y-1">
                <li>Designed API test cases with Postman, executed 500 manual tests every release.</li>
                <li>Automated 200+ cases using Selenium, reducing manual testing time by 35%.</li>
              </ul>
            </div>
          </div>

          {/* 证书与教育 Certs & Education */}
          <div className="mb-4">
            <h3 className="font-bold bg-black text-white inline-block px-2 mb-2">/// CERTS & EDUCATION</h3>
            <ul className="list-square pl-4 text-xs space-y-2">
              <li>
                <span className="font-bold text-sm">🏆 AWS Certified Solutions Architect - Associate</span><br/>
                <span className="text-gray-600">Mastered Lambda, DynamoDB, API Gateway, EC2, RDS.</span>
              </li>
              <li>
                <span className="font-bold">Udemy:</span> Complete Full-Stack Web Dev Bootcamp & Python DSA.
              </li>
              <li className="pt-1">
                <span className="font-bold">University of Nottingham (MSc CS):</span> Merit Award. Led 2 teams, wrote Python Selenium scripts for visa slots.
              </li>
              <li>
                <span className="font-bold">Beijing Union University (BEng SE):</span> GPA 83 (Top 10%).
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