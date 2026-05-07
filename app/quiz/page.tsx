'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getStepConfig, userFacingSteps, StepContext, QuizStep } from '@/config/quizFlow';
import { useQuizStore, QuizState } from '@/store/useQuizStore';
import { ProgressBar } from '@/components/ui/ProgressBar';
import NavigationButtons from './NavigationButtons';
import { StepLayout } from '@/components/quiz/StepLayout';
import { OptionList } from '@/components/quiz/OptionList';
import { Step4Analysis } from '@/components/quiz/Step4Analysis';
import { InputQuestion } from '@/components/quiz/InputQuestion';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { cn } from '@/utils/cn';

const variants = {
  initial: (dir: number) => ({ x: dir * 60, opacity: 0 }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
  exit: (dir: number) => ({
    x: dir * -60,
    opacity: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  }),
};

const getPhaseInfo = (stepId: string) => {
  if (['gender', 'goal'].includes(stepId)) return '基础信息';
  if (['age', 'height', 'weight', 'targetWeight'].includes(stepId)) return '身体数据';
  if (['activity'].includes(stepId)) return '运动频率';
  return '正在处理';
};

const getMotivationalText = (percent: number) => {
  if (percent <= 20) return "良好的开始是成功的一半 ✨";
  if (percent <= 50) return "您的专属健康档案正在建立中...";
  if (percent <= 80) return "就快到了！只剩最后几步 🏃";
  return "马上完成啦！🎉";
};

export default function QuizPage() {
  const currentStepId = useQuizStore((s) => s.currentStepId);
  const direction = useQuizStore((s) => s.direction);
  const setField = useQuizStore((s) => s.setField);

  // 各单选字段（顶层 hooks，保证响应式）
  const gender = useQuizStore((s) => s.gender);
  const goal = useQuizStore((s) => s.goal);
  const unit = useQuizStore((s) => s.unit);
  const age = useQuizStore((s) => s.age);
  const height = useQuizStore((s) => s.height);
  const weight = useQuizStore((s) => s.weight);
  const targetWeight = useQuizStore((s) => s.targetWeight);
  const activityLevel = useQuizStore((s) => s.activityLevel);
  const theme = useQuizStore((s) => s.theme);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  // Sync theme to root element
  useEffect(() => {
    if (isMounted && theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, isMounted]);

  const stepConfig = getStepConfig(currentStepId);
  useEffect(() => {
    if (isMounted && !stepConfig) {
      useQuizStore.getState().reset();
    }
  }, [isMounted, stepConfig]);

  if (!isMounted || !stepConfig) return null;

  // ── 进度条计算（只计 userFacingSteps，当前 step 不计入）──────────
  const userFacingIndex = userFacingSteps.findIndex((s) => s.id === currentStepId);
  const progressPercent =
    userFacingIndex >= 0
      ? Math.round((userFacingIndex / userFacingSteps.length) * 100)
      : 100;

  // ── 构建 StepContext 供动态 options 使用 ────────
  const ctx: StepContext = { unit, height, weight, goal };

  // ── 根据 field 获取当前选中值 ─────────────────
  const getSelectedValue = (config: QuizStep): string => {
    const fieldMap: Record<string, string> = {
      gender, goal, unit, age, height, weight,
      targetWeight, activityLevel,
    };
    return config.field ? (fieldMap[config.field] ?? '') : '';
  };

  // ── 渲染业务内容 ─────────────────────────────
  const renderContent = () => {
    if (stepConfig.type === 'analysis') {
      return <Step4Analysis />;
    }

    const options = stepConfig.dynamicOptions
      ? stepConfig.dynamicOptions(ctx)
      : stepConfig.options ?? [];

    const subtitle = stepConfig.dynamicSubtitle
      ? stepConfig.dynamicSubtitle(ctx)
      : stepConfig.subtitle;

    return (
      <StepLayout title={stepConfig.title} subtitle={subtitle}>
        {stepConfig.type === 'input' ? (
          <InputQuestion field={stepConfig.field as 'age' | 'height' | 'weight' | 'targetWeight'} />
        ) : (
          <OptionList
            options={options}
            selectedValue={getSelectedValue(stepConfig)}
            onSelect={(value) => {
              setField(
                stepConfig.field as keyof QuizState,
                value as QuizState[keyof QuizState]
              );
            }}
            autoNext={!!stepConfig.nextStep}
            onAutoNext={() => {
              if (stepConfig.nextStep) {
                useQuizStore.getState().setDirection(1);
                useQuizStore.getState().setCurrentStepId(stepConfig.nextStep);
              }
            }}
          />
        )}
      </StepLayout>
    );
  };

  const isAnalysis = stepConfig.type === 'analysis';

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* 顶部进度条（分析页隐藏） */}
      {!isAnalysis && (
        <div className="pt-6 relative flex flex-col items-center w-full">
          <div className="absolute left-6 top-2">
            <button
              onClick={() => {
                if (stepConfig.prevStep) {
                  useQuizStore.getState().setDirection(-1);
                  useQuizStore.getState().setCurrentStepId(stepConfig.prevStep);
                }
              }}
              disabled={!stepConfig.prevStep}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all shrink-0",
                !stepConfig.prevStep && "opacity-0 pointer-events-none"
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
          </div>

          <div className="absolute right-6 top-2">
            <ThemeSwitcher />
          </div>

          <div className="w-full flex flex-col items-center pt-1">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-2.5">
              {getPhaseInfo(currentStepId)}
            </p>
            <ProgressBar value={progressPercent} segments={[2, 4, 1]} className="px-1 gap-1 sm:gap-2" />
            <p className="text-xs text-primary font-medium mt-2.5 text-center px-6">
              {getMotivationalText(progressPercent)}
            </p>
          </div>
        </div>
      )}

      {/* 步骤动画容器 */}
      <div className="flex-1 relative overflow-hidden min-h-0">
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
            <div className="min-h-full max-w-2xl mx-auto px-6 py-8 flex flex-col">
              {renderContent()}

              {/* 分析页不显示导航按钮 */}
              {!isAnalysis && (
                <NavigationButtons
                  nextStep={stepConfig.nextStep}
                  showNext={stepConfig.type === 'input'}
                  disableNext={!getSelectedValue(stepConfig)}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
