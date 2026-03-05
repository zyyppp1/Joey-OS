import React from 'react';
import RetroWindow from '../components/RetroWindow';
import AiChat from '../components/AiChat'; // <--- 新增这一行

export default function Home() {
  return (
    <main className="h-screen w-screen relative overflow-hidden">
      {/* 桌面背景文字 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-white/40 text-6xl font-bold tracking-widest drop-shadow-md font-mono">
          Joey OS
        </h1>
      </div>
      
      {/* 测试窗口 1 */}
      <RetroWindow 
        title="README.txt" 
        defaultX={50} 
        defaultY={50} 
        defaultWidth={350} 
        defaultHeight={250}
      >
        <h2 className="text-xl font-bold mb-2">Welcome to Joey OS! 🚀</h2>
        <p className="mb-2">这是一个基于 Next.js + Tailwind CSS 打造的复古监控桌面。</p>
        <p>你可以尝试：</p>
        <ul className="list-disc pl-5 mt-2">
          <li>按住顶部的黑白条纹标题栏来拖拽我</li>
          <li>把鼠标放到我的右下角边缘来拉伸大小</li>
          <li>点击左上角的小方块关闭我</li>
        </ul>
      </RetroWindow>

      {/* 测试窗口 2 */}
      <RetroWindow 
        title="AI_Joey.exe" 
        defaultX={450} 
        defaultY={100} 
        defaultWidth={300} 
        defaultHeight={400}
      >
        <AiChat />
        
      </RetroWindow>

    </main>
  );
}