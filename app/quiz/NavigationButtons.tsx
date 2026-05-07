'use client';

import { useQuizStore } from '@/store/useQuizStore';
import { cn } from '@/utils/cn';

interface NavigationButtonsProps {
  nextStep?: string;
  showNext?: boolean;
  disableNext?: boolean;
  /** 注入前置校验钩子，返回 false 则阻止跳转 */
  onBeforeNext?: () => boolean;
}

/**
 * NavigationButtons: 底部下一步导航
 * 支持通过 onBeforeNext 拦截 next 动作（用于 Step2 的表单校验）
 */
export default function NavigationButtons({
  nextStep,
  showNext,
  disableNext,
  onBeforeNext,
}: NavigationButtonsProps) {
  const setDirection = useQuizStore((state) => state.setDirection);
  const setCurrentStepId = useQuizStore((state) => state.setCurrentStepId);

  const handleNext = () => {
    if (!nextStep) return;
    // 若有前置校验且未通过，则阻止跳转
    if (onBeforeNext && !onBeforeNext()) return;
    setDirection(1);
    setCurrentStepId(nextStep);
  };

  if (!showNext || !nextStep) return null;

  return (
    <div className="mt-auto pt-8 flex justify-center pb-8">
      <button
        onClick={handleNext}
        disabled={disableNext}
        className={cn(
          'w-fit px-14 py-4 rounded-2xl font-bold text-white text-lg transition-all',
          disableNext
            ? 'bg-gray-300 cursor-not-allowed opacity-70'
            : 'bg-primary hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl shadow-primary/20'
        )}
      >
        Next
      </button>
    </div>
  );
}
