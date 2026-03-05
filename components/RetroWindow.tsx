"use client";

import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';

// 🚀 核心黑科技：模块级全局变量，记录当前最高的窗口层级
let highestZIndex = 100;

interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  defaultX?: number;
  defaultY?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  onClose?: () => void;
}

export default function RetroWindow({
  title,
  children,
  defaultX = 50,
  defaultY = 50,
  defaultWidth = 400,
  defaultHeight = 300,
  onClose,
}: RetroWindowProps) {
  const [isClosed, setIsClosed] = useState(false);
  const [zIndex, setZIndex] = useState(highestZIndex);
  const [isMounted, setIsMounted] = useState(false);
  const [initProps, setInitProps] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    // 每次打开新窗口，自动置顶
    highestZIndex += 1;
    setZIndex(highestZIndex);

    // 📱 移动端自适应逻辑
    const isMobile = window.innerWidth < 768;
    
    // 如果是手机，宽度设为屏幕宽度减去20px留白，高度减去100px
    const safeWidth = isMobile ? window.innerWidth - 20 : defaultWidth;
    const safeHeight = isMobile ? window.innerHeight - 100 : defaultHeight;
    
    // 手机上统一定位到靠左，并随机错开一点 Y 轴，方便看到后面的窗口
    const safeX = isMobile ? 10 : defaultX;
    const safeY = isMobile ? 60 + (Math.random() * 40) : defaultY;

    setInitProps({
      x: safeX,
      y: safeY,
      width: safeWidth,
      height: safeHeight
    });

    setIsMounted(true);
  }, [defaultX, defaultY, defaultWidth, defaultHeight]);

  // 点击或触摸窗口时，把这个窗口拉到最前面
  const bringToFront = () => {
    highestZIndex += 1;
    setZIndex(highestZIndex);
  };

  // 解决 SSR 水合报错问题
  if (isClosed || !isMounted) return null;

  return (
    <Rnd
      default={initProps}
      dragHandleClassName="window-handle"
      bounds="window" 
      minWidth={250}
      minHeight={150}
      style={{ zIndex }} // 动态控制层级
      onMouseDown={bringToFront} // 鼠标点击置顶
      onTouchStart={bringToFront} // 手指触摸置顶
    >
      <div className="w-full h-full bg-white border-2 border-black flex flex-col shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        
        {/* 标题栏 (加了 touch-none 防止手机拖拽时误触网页滚动) */}
        <div className="window-handle flex items-center justify-between px-2 py-1 border-b-2 border-black bg-white cursor-move touch-none">
          <button 
            onClick={() => {
              setIsClosed(true);
              if (onClose) onClose();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation(); // 阻断触摸事件，防止点不到关闭按钮
              setIsClosed(true);
              if (onClose) onClose();
            }}
            className="w-4 h-4 border-2 border-black bg-white hover:bg-black active:bg-gray-500 transition-colors z-20"
            aria-label="Close"
          />
          
          <div className="flex-1 mx-2 text-center relative flex items-center justify-center pointer-events-none">
            <div 
              className="absolute inset-0" 
              style={{ backgroundImage: 'repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 3px)' }}
            />
            <span className="bg-white px-2 font-bold text-xs md:text-sm z-10 text-black whitespace-nowrap overflow-hidden text-ellipsis max-w-[80%]">
              {title}
            </span>
          </div>
          <div className="w-4 h-4 border-2 border-black bg-white pointer-events-none" />
        </div>

        {/* 内容区 */}
        <div className="flex-1 p-3 md:p-4 overflow-auto bg-[#f0f0f0] text-black">
          {children}
        </div>

      </div>
    </Rnd>
  );
}