"use client";
import React from 'react';

export default function ResumeApp() {
  return (
    <div className="font-mono text-sm text-black h-full flex flex-col">
      
      {/* 顶部：标题与下载按钮 */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">Joey (Yepeng) Zhu</h2>
          <p className="text-gray-700 font-bold mt-1">Fullstack / Backend / DevOps Engineer</p>
        </div>
        {/* 简历下载按钮 */}
        <a 
          href="/Joey_Resume.pdf" 
          download="Joey_Yepeng_Zhu_Resume.pdf"
          className="bg-black text-white px-4 py-2 font-bold hover:bg-gray-800 active:translate-y-1 shadow-[2px_2px_0px_rgba(0,0,0,0.3)] transition-all cursor-pointer"
        >
          ⬇️ DOWNLOAD PDF
        </a>
      </div>

      {/* 滚动内容区 */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        
        {/* Experience */}
        <section>
          <h3 className="font-bold bg-black text-white inline-block px-2 mb-3">/// EXPERIENCES</h3>
          
          {/* 公司 1 */}
          <div className="flex gap-4 mb-4 items-start">
            <div className="w-12 h-12 bg-white border-2 border-black flex-shrink-0 flex items-center justify-center p-1 cursor-pointer hover:bg-gray-100">
              {/* 替换为你真实的图片路径 */}
              <img src="/images/spinnrtech_red.avif" alt="SpinnrTech" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-lg leading-none">SpinnrTech</h4>
                <span className="text-xs bg-gray-200 px-1 border border-black">Jul 2025 - Present</span>
              </div>
              <p className="text-sm font-bold text-blue-800 mb-1">Backend Engineer</p>
              <ul className="list-disc pl-4 text-xs space-y-1 text-gray-800">
                <li>Developed secure, high-performance RESTful APIs & microservices using Node.js, Go, and Lua.</li>
                <li>Implemented comprehensive logging, error handling, and monitoring.</li>
              </ul>
            </div>
          </div>

          {/* 公司 2 */}
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-white border-2 border-black flex-shrink-0 flex items-center justify-center p-1 cursor-pointer hover:bg-gray-100">
              <img src="/images/EVBG.png" alt="Everbridge" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-lg leading-none">Everbridge</h4>
                <span className="text-xs bg-gray-200 px-1 border border-black">Jul 2022 - Mar 2023</span>
              </div>
              <p className="text-sm font-bold text-blue-800 mb-1">QA Engineer / SDET</p>
              <ul className="list-disc pl-4 text-xs space-y-1 text-gray-800">
                <li>Collaborated in a Scrum team to test web and mobile releases.</li>
                <li>Automated 200+ cases using Selenium, reducing manual testing time by 35%.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education */}
        <section>
          <h3 className="font-bold bg-black text-white inline-block px-2 mb-3">/// EDUCATION</h3>
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-white border-2 border-black flex-shrink-0 flex items-center justify-center p-1">
              <img src="/images/NottinghamLogo.png" alt="Nottingham" className="w-full h-full object-contain" />
            </div>
            <div>
              <h4 className="font-bold text-base">University of Nottingham</h4>
              <p className="text-xs font-bold text-gray-600">MSc in Computer Science (2023 - 2024)</p>
              <p className="text-xs mt-1">Merit Award Graduate. Wrote a Python Selenium script to search US visa interview slots and earned £2000+ in two weeks.</p>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section>
          <h3 className="font-bold bg-black text-white inline-block px-2 mb-3">/// CERTIFICATIONS</h3>
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-white border-2 border-black flex-shrink-0 flex items-center justify-center p-1">
              <img src="/images/aws.png" alt="AWS SAA" className="w-full h-full object-contain" />
            </div>
            <div>
              <h4 className="font-bold text-base">AWS Certified Solutions Architect</h4>
              <p className="text-xs font-bold text-gray-600">Associate Level</p>
              <p className="text-xs mt-1">Mastered Serverless Fundamentals (Lambda, DynamoDB, API Gateway) and Disaster Recovery.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}