"use client";

import React from 'react';
import { Rnd } from 'react-rnd';

interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  defaultX: number;
  defaultY: number;
  defaultWidth: number | string;
  defaultHeight: number | string;
  onClose: () => void;
  onMinimize: () => void;
  onClickWindow?: () => void;
  isMinimized?: boolean;
  zIndex?: number;
}

export default function RetroWindow({
  title,
  children,
  defaultX,
  defaultY,
  defaultWidth,
  defaultHeight,
  onClose,
  onMinimize,
  onClickWindow,
  isMinimized = false,
  zIndex = 10,
}: RetroWindowProps) {

  return (
    <Rnd
      default={{ x: defaultX, y: defaultY, width: defaultWidth, height: defaultHeight }}
      dragHandleClassName="window-handle"
      cancel=".cancel-drag" // 💡 核心修复 1：告诉 react-rnd 遇到这个 class 时，禁止触发拖拽！
      bounds="parent" 
      minWidth={300}
      minHeight={200}
      style={{
        visibility: isMinimized ? 'hidden' : 'visible',
        opacity: isMinimized ? 0 : 1,
        pointerEvents: isMinimized ? 'none' : 'auto',
        transition: 'opacity 0.2s ease-in-out',
        zIndex: zIndex
      }}
      onMouseDown={onClickWindow} 
      onTouchStart={onClickWindow} // 💡 移动端点击窗口任意处提升层级
    >
      <div className="w-full h-full bg-white border-2 border-black flex flex-col shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        
        {/* 标题栏 */}
        <div className="window-handle flex items-center justify-between px-2 py-1 border-b-2 border-black bg-white cursor-move">
          
          {/* 左上角：最小化按钮 */}
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            onTouchEnd={(e) => { e.stopPropagation(); onMinimize(); }} // 💡 核心修复 2：移动端直接监听触摸结束，告别点击延迟！
            className="cancel-drag w-6 h-6 md:w-4 md:h-4 border-2 border-black bg-white hover:bg-gray-300 active:bg-gray-500 transition-colors"
            title="Minimize"
          />
          
          <div className="flex-1 mx-2 text-center relative flex items-center justify-center">
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 3px)' }} />
            <span className="bg-white px-2 font-bold text-sm z-10 text-black truncate max-w-[70%]">{title}</span>
          </div>

          {/* 右上角：关闭按钮 */}
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            onTouchEnd={(e) => { e.stopPropagation(); onClose(); }} // 💡 核心修复 2：移动端秒触响应
            className="cancel-drag w-6 h-6 md:w-4 md:h-4 border-2 border-black bg-red-500 hover:bg-red-600 active:bg-red-800 transition-colors"
            title="Close"
          />
        </div>

        {/* 内容区 */}
        <div className="flex-1 p-3 overflow-auto bg-[#f0f0f0] text-black">
          {children}
        </div>

      </div>
    </Rnd>
  );
}