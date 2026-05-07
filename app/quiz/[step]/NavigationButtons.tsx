'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuizStore, QuizState } from '@/store/useQuizStore';
import { validateField } from '@/utils/validation';

export default function NavigationButtons({ prevStep, nextStep }: { prevStep?: string; nextStep?: string }) {
  const router = useRouter();
  const params = useParams();
  const stepId = params.step as string;
  const setDirection = useQuizStore((state) => state.setDirection);
  
  // Get current field and value for validation
  const state = useQuizStore();
  const unit = state.unit;

  // Determine if we should disable the "Next" button
  const isInvalid = (() => {
    // Only validate input steps
    if (['age', 'height', 'weight', 'targetWeight'].includes(stepId)) {
      const field = stepId as keyof QuizState;
      const value = state[field] as string;
      const error = validateField(stepId, value, unit);
      return error.startsWith('⚠️');
    }
    // For single_choice steps, ensure something is selected
    if (['gender', 'goal', 'activity'].includes(stepId)) {
      const field = stepId === 'activity' ? 'activityLevel' : stepId as keyof QuizState;
      return !state[field];
    }
    return false;
  })();

  const handleNext = () => {
    if (nextStep && !isInvalid) {
      setDirection(1);
      router.push(`/quiz/${nextStep}`);
    }
  };

  const handlePrev = () => {
    if (prevStep) {
      setDirection(-1);
      router.push(`/quiz/${prevStep}`);
    }
  };

  return (
    <div className="mt-auto flex justify-between gap-4 pt-4">
      {prevStep ? (
        <button
          onClick={handlePrev}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          Back
        </button>
      ) : <div />}
      {nextStep ? (
        <button
          onClick={handleNext}
          disabled={isInvalid}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            isInvalid 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          Next
        </button>
      ) : <div />}
    </div>
  );
}
