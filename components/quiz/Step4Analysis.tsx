'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/store/useQuizStore';

const getMessage = (p: number) => {
  if (p < 20) return '初始化分析引擎...';
  if (p < 40) return '检索目标人群与体型特征数据库...';
  if (p < 60) return '正在分析您的多维度身体指标...';
  if (p < 80) return '运行深度特征匹配算法...';
  if (p < 95) return '对比样本，构建个人代谢数字模型...';
  return '正在生成高精度专属健康方案...';
};

/**
 * Step4Analysis: 3.5 秒假加载动画，结束后自动跳转 result
 * - 径向进度条动画，带有停顿的卡顿感
 * - 包含技术词汇的文案
 * - useEffect 3500ms 后 setCurrentStepId('result')
 */
export function Step4Analysis() {
  const setCurrentStepId = useQuizStore((s) => s.setCurrentStepId);
  const setDirection = useQuizStore((s) => s.setDirection);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    // Simulate laggy progress over ~7.5 seconds
    const steps = [
      { p: 8, t: 300 },
      { p: 17, t: 800 },
      { p: 24, t: 1600 }, // Lag
      { p: 41, t: 2500 },
      { p: 49, t: 3200 }, // Lag
      { p: 56, t: 4500 }, // Big lag
      { p: 78, t: 5500 },
      { p: 89, t: 6200 },
      { p: 95, t: 6800 },
      { p: 99, t: 7200 },
      { p: 100, t: 7500 }
    ];

    steps.forEach(({ p, t }) => {
      setTimeout(() => {
        if (isMounted) setProgress(p);
      }, t);
    });

    const timeout = setTimeout(() => {
      if (isMounted) {
        setDirection(1);
        setCurrentStepId('result');
      }
    }, 7800); // Wait slightly after 100% before redirecting

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [setCurrentStepId, setDirection]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const currentMessage = getMessage(progress);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 gap-8">
      {/* 径向加载进度条 */}
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-48 h-48 drop-shadow-xl">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-100 dark:text-gray-800"
          />
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-200 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-gray-800 dark:text-white tabular-nums tracking-tight">
            {progress}%
          </span>
        </div>
      </div>

      {/* 动态技术词汇文案 */}
      <div className="h-16 flex items-center justify-center mt-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-lg font-bold text-gray-700 dark:text-gray-200 text-center px-4"
          >
            {currentMessage}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* 底部伪代码台（增加极客感） */}
      <div className="w-full max-w-[240px] mt-2">
        <div className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between text-xs font-mono text-gray-400 dark:text-gray-500">
            <span>SYS_MEM:</span>
            <span className="text-primary">OK</span>
          </div>
          <div className="flex justify-between text-xs font-mono text-gray-400 dark:text-gray-500">
            <span>DB_QUERY:</span>
            <span>{progress > 40 ? 'MATCHED' : 'SEARCHING...'}</span>
          </div>
          <div className="flex justify-between text-xs font-mono text-gray-400 dark:text-gray-500">
            <span>LATENCY:</span>
            <span>{progress % 2 === 0 ? '12ms' : '48ms'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
