import React from 'react';

export default function Home() {
  return (
    <main className="h-screen w-screen relative">
      {/* 桌面背景文字 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-white/50 text-4xl font-bold tracking-widest drop-shadow-md">
          Joey OS v2.0
        </h1>
      </div>
      
      {/* 以后我们的图标和复古窗口都会放在这里 */}
      
    </main>
  );
}