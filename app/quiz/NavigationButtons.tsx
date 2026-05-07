'use client';

import { useQuizStore } from '@/store/useQuizStore';

export default function NavigationButtons({ prevStep, nextStep }: { prevStep?: string; nextStep?: string }) {
  const setDirection = useQuizStore((state) => state.setDirection);
  const setCurrentStepId = useQuizStore((state) => state.setCurrentStepId);

  const handleNext = () => {
    if (nextStep) {
      setDirection(1);
      setCurrentStepId(nextStep);
    }
  };

  const handlePrev = () => {
    if (prevStep) {
      setDirection(-1);
      setCurrentStepId(prevStep);
    }
  };

  return (
    <div className="mt-auto flex justify-between gap-4 pt-4">
      {prevStep ? (
        <button
          onClick={handlePrev}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          上一步
        </button>
      ) : <div />}
      {nextStep ? (
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          下一步
        </button>
      ) : <div />}
    </div>
  );
}
