import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Gender = 'male' | 'female' | '';
export type Goal = 'lose_weight' | 'gain_muscle' | 'shape_body' | '';
export type Unit = 'metric' | 'imperial';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'super_active' | '';
export type Theme = 'ocean' | 'coral' | 'mint';

export interface QuizState {
  currentStepId: string;
  gender: Gender;
  goal: Goal;
  unit: Unit;
  age: string;
  height: string;
  weight: string;
  targetWeight: string;
  activityLevel: ActivityLevel;
  direction: number;
  theme: Theme;
}

export interface QuizActions {
  setCurrentStepId: (id: string) => void;
  setField: <K extends keyof QuizState>(field: K, value: QuizState[K]) => void;
  setDirection: (direction: number) => void;
  reset: () => void;
}

const initialState: QuizState = {
  currentStepId: 'gender',
  gender: '',
  goal: '',
  unit: 'metric',
  age: '',
  height: '',
  weight: '',
  targetWeight: '',
  activityLevel: '',
  direction: 1,
  theme: 'ocean',
};

export const useQuizStore = create<QuizState & QuizActions>()(
  persist(
    (set) => ({
      ...initialState,
      setCurrentStepId: (id) => set({ currentStepId: id }),
      setField: (field, value) => set((state) => ({ ...state, [field]: value })),
      setDirection: (direction) => set({ direction }),
      reset: () => set(initialState),
    }),
    {
      name: 'quiz-storage',
    }
  )
);
