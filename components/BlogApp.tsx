"use client";

import React, { useState } from 'react';
import { BLOG_POSTS, BlogPost } from '../data/blogs';

export default function BlogApp() {
  const [activePost, setActivePost] = useState<BlogPost>(BLOG_POSTS[0]);

  return (
    <div className="flex h-full font-mono text-sm text-black border-2 border-black bg-white shadow-[inset_2px_2px_0px_rgba(0,0,0,0.2)]">
      
      {/* 左侧：文件树 (File Explorer) */}
      <div className="w-1/3 border-r-2 border-black bg-gray-200 p-2 overflow-y-auto">
        <h3 className="font-bold mb-3 border-b border-gray-400 pb-1">C:\\Joey\\Blogs\\</h3>
        <ul className="space-y-1">
          {BLOG_POSTS.map((post) => (
            <li 
              key={post.id}
              onClick={() => setActivePost(post)}
              className={`cursor-pointer px-1 py-1 truncate transition-colors ${
                activePost.id === post.id 
                  ? 'bg-blue-600 text-white font-bold' 
                  : 'hover:bg-gray-300'
              }`}
            >
              📄 {post.filename}
            </li>
          ))}
        </ul>
      </div>

      {/* 右侧：记事本内容区 (Notepad) */}
      <div className="w-2/3 p-4 overflow-y-auto bg-white relative">
        <div className="border-b-2 border-dashed border-gray-300 mb-4 pb-2">
          <h2 className="text-xl font-bold">{activePost.title}</h2>
          <p className="text-xs text-gray-500 mt-1">LAST_MODIFIED: {activePost.date}</p>
        </div>
        
        <div className="whitespace-pre-wrap leading-relaxed">
          {activePost.content}
        </div>
        
        {/* 纯粹的装饰性光标 */}
        <span className="inline-block w-2 h-4 bg-black animate-pulse mt-4"></span>
      </div>

    </div>
  );
}