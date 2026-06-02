"use client";

import React from 'react';

export default function LinkedInApp() {
  return (
    <div className="flex flex-col h-full bg-black text-amber-500 font-mono p-1 overflow-hidden relative border-4 border-gray-800">
      
      {/* CSS 激光扫描动画注入 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanline {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .scan-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 4px;
          background: rgba(245, 158, 11, 0.5);
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.8);
          animation: scanline 3s linear infinite;
          z-index: 20;
          pointer-events: none;
        }
      `}} />

      <div className="scan-line"></div>

      {/* 顶部绝密标识 */}
      <div className="text-center border-b-2 border-amber-500 pb-2 mb-4 mt-2">
        <h2 className="text-2xl font-black tracking-[0.3em] uppercase">Classified</h2>
        <p className="text-xs">AGENCY ID: LNKD-IN-8894</p>
      </div>

      <div className="flex flex-1 px-4 gap-4 items-center">
        {/* 左侧：像素化头像框 */}
        <div className="w-32 h-40 border-2 border-amber-500 p-1 relative group">
          <div className="w-full h-full bg-gray-900 flex items-center justify-center overflow-hidden grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500">
            {/* 我们借用你 GitHub 的头像作为档案照片，自带极客感 */}
            <img src="https://avatars.githubusercontent.com/zyyppp1" alt="Agent Avatar" className="w-full h-full object-cover opacity-80" />
          </div>
          <div className="absolute bottom-0 left-0 bg-amber-500 text-black text-[10px] px-1 font-bold w-full text-center">
            MATCH: 99.9%
          </div>
        </div>

        {/* 右侧：档案信息 */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs text-gray-500">SUBJECT_NAME:</p>
            <p className="text-lg font-bold text-white">YEPENG (JOEY) ZHU</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">SPECIALIZATION:</p>
            <p className="text-sm">Fullstack / Cloud / DevOps</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">LOCATION:</p>
            <p className="text-sm">London, United Kingdom</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">STATUS:</p>
            <p className="text-sm animate-pulse text-green-400">OPEN TO WORK</p>
          </div>
        </div>
      </div>

      {/* 底部闪烁的连接按钮 */}
      <div className="p-4 mt-auto">
        <a 
          href="https://www.linkedin.com/in/yepeng-zhu-9b0021314"
          target="_blank"
          className="block w-full text-center py-3 bg-amber-500 text-black font-black text-sm hover:bg-amber-400 active:bg-amber-600 transition-colors"
        >
          [ ESTABLISH SECURE CONNECTION TO LINKEDIN ]
        </a>
      </div>

    </div>
  );
}