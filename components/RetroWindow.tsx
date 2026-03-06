"use client";

import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  defaultX?: number;
  defaultY?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  onClose?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean; // 新增：控制是否隐藏
}

export default function RetroWindow({
  title,
  children,
  defaultX = 50,
  defaultY = 50,
  defaultWidth = 400,
  defaultHeight = 300,
  onClose,
  onMinimize,
  isMinimized = false,
}: RetroWindowProps) {
  
  // 如果被最小化了，我们就用 CSS 把它藏起来，但它依然在后台运行！
  return (
    <div style={{ display: isMinimized ? 'none' : 'block' }}>
      <Rnd
        default={{ x: defaultX, y: defaultY, width: defaultWidth, height: defaultHeight }}
        dragHandleClassName="window-handle"
        bounds="window" 
        minWidth={250}
        minHeight={150}
        style={{ zIndex: 10 }}
      >
        <div className="w-full h-full bg-white border-2 border-black flex flex-col shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          
          {/* 标题栏 */}
          <div className="window-handle flex items-center justify-between px-2 py-1 border-b-2 border-black bg-white cursor-move">
            
            {/* 左上角：最小化按钮 (白色，点击收起) */}
            <button 
              onClick={() => { if (onMinimize) onMinimize(); }}
              className="w-4 h-4 border-2 border-black bg-white hover:bg-gray-300 active:bg-gray-500 transition-colors"
              title="Minimize"
            />
            
            <div className="flex-1 mx-2 text-center relative flex items-center justify-center">
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 3px)' }} />
              <span className="bg-white px-2 font-bold text-sm z-10 text-black">{title}</span>
            </div>

            {/* 右上角：关闭按钮 (醒目的红色) */}
            <button 
              onClick={() => { if (onClose) onClose(); }}
              className="w-4 h-4 border-2 border-black bg-red-500 hover:bg-red-600 active:bg-red-800 transition-colors"
              title="Close"
            />
          </div>

          {/* 内容区 */}
          <div className="flex-1 p-4 overflow-auto bg-[#f0f0f0] text-black">
            {children}
          </div>

        </div>
      </Rnd>
    </div>
  );
}