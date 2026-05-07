'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getStepConfig } from '@/config/quizFlow';
import { useQuizStore } from '@/store/useQuizStore';
import NavigationButtons from './NavigationButtons';

export default function QuizPage() {
  const currentStepId = useQuizStore((state) => state.currentStepId);
  const direction = useQuizStore((state) => state.direction);

  // 防止 SSR 渲染和服务端 localStorage 不一致导致的水合错误
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 若 currentStepId 找不到对应配置，在渲染后重置 store（不能在渲染阶段直接调用 setState）
  const stepConfig = getStepConfig(currentStepId);
  useEffect(() => {
    if (isMounted && !stepConfig) {
      useQuizStore.getState().reset();
    }
  }, [isMounted, stepConfig]);

  if (!isMounted || !stepConfig) return null;

  const variants = {
    initial: (dir: number) => ({
      x: dir * 50,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: (dir: number) => ({
      x: dir * -50,
      opacity: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }),
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={currentStepId}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 overflow-y-auto"
        >
          {/* 弹性内容区：移动端全屏，PC端居中限宽以保证阅读舒适度 */}
          <div className="min-h-full max-w-2xl mx-auto px-6 py-10 flex flex-col">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
              {stepConfig.title}
            </h1>
            {stepConfig.subtitle && (
              <p className="text-base font-medium text-gray-500 mb-8">
                {stepConfig.subtitle}
              </p>
            )}

            {/* 假组件充当 Step 内容，用于测试流转 */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8">
              <p className="text-gray-500 font-medium">Step ID: {stepConfig.id}</p>
              <p className="text-gray-500 font-medium">Type: {stepConfig.type}</p>
              <p className="text-gray-400 text-sm mt-4 text-center">
                (纯文本组件，SPA 模式测试)
              </p>
            </div>

            <NavigationButtons prevStep={stepConfig.prevStep} nextStep={stepConfig.nextStep} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
