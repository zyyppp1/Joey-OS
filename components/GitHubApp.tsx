"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function GitHubApp() {
  const [userData, setUserData] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>(['> Initializing GitHub Protocol...']);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGitHub = async () => {
      try {
        // 模拟黑客入侵的步骤延迟感
        setTimeout(() => setLogs(p => [...p, '> Fetching data from api.github.com/users/zyyppp1...']), 600);
        
        const userRes = await fetch('https://api.github.com/users/zyyppp1');
        if (!userRes.ok) throw new Error('API_RATE_LIMIT');
        const user = await userRes.json();
        setUserData(user);
        
        setTimeout(() => setLogs(p => [...p, `> SUCCESS: Target acquired.`]), 1200);
        setTimeout(() => setLogs(p => [...p, `> USER: ${user.login} | ID: ${user.id}`]), 1600);
        setTimeout(() => setLogs(p => [...p, `> PUBLIC_REPOS: ${user.public_repos} | FOLLOWERS: ${user.followers}`]), 2000);
        setTimeout(() => setLogs(p => [...p, '> Scanning recent repositories...']), 2600);

        const reposRes = await fetch('https://api.github.com/users/zyyppp1/repos?sort=updated&per_page=5');
        const repoData = await reposRes.json();
        setRepos(repoData);
        
        setTimeout(() => setLogs(p => [...p, '> SUCCESS: Repositories loaded. Ready for inspection.']), 3500);

      } catch (e) {
        setTimeout(() => setLogs(p => [...p, '> [ERROR] Connection blocked by GitHub Rate Limiter or Network issue.']), 1000);
      }
    };
    fetchGitHub();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col md:flex-row h-full font-mono text-sm text-[#4ade80] bg-black border-2 border-black overflow-hidden shadow-[inset_0px_0px_15px_rgba(74,222,128,0.2)]">
      
      {/* 左侧：实时 API 抓取终端 */}
      <div className="w-full md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-[#4ade80] flex flex-col">
        <h3 className="text-white font-bold mb-2 border-b border-[#4ade80] pb-1 uppercase tracking-widest">Target: @zyyppp1</h3>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 text-xs">
          {logs.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
          {/* 最近的项目列表 */}
          {repos.length > 0 && (
            <div className="mt-4 border border-[#4ade80] p-2 bg-[#4ade80]/10">
              <p className="text-white font-bold mb-2">[ RECENT COMMITS ]</p>
              <ul className="space-y-2">
                {repos.map(repo => (
                  <li key={repo.id} className="truncate">
                    <a href={repo.html_url} target="_blank" className="hover:text-white underline decoration-dashed">
                      ./{repo.name}
                    </a>
                    <span className="text-gray-400 ml-2">({repo.language || 'Code'})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <span className="inline-block w-2 h-4 bg-[#4ade80] animate-pulse mt-2"></span>
        </div>
      </div>

      {/* 右侧：SVG 统计图卡片 */}
      <div className="w-full md:w-1/2 p-4 flex flex-col items-center justify-center relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black">
        <p className="text-xs text-gray-500 absolute top-2 left-2">{">>>"} VISUALIZED_METRICS.SVG</p>
        
        {/* 使用 github-readme-stats，修正了透明背景参数 */}
        <img 
          src="https://github-readme-stats.vercel.app/api?username=zyyppp1&show_icons=true&hide_bg=true&title_color=ffffff&text_color=4ade80&icon_color=ffffff&hide_border=true" 
          alt="GitHub Stats"
          className="w-full max-w-[300px] drop-shadow-[0_0_10px_rgba(74,222,128,0.4)]"
        />

        <a 
          href="https://github.com/zyyppp1" 
          target="_blank"
          className="mt-6 px-6 py-2 border-2 border-[#4ade80] text-[#4ade80] font-bold hover:bg-[#4ade80] hover:text-black transition-all shadow-[0_0_10px_rgba(74,222,128,0.5)]"
        >
          [ ACCESS FULL REPOSITORY ]
        </a>
      </div>

    </div>
  );
}