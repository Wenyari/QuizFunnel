import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Gender = 'male' | 'female' | '';
export type Goal = 'lose_weight' | 'gain_muscle' | 'shape_body' | '';
export type Unit = 'metric' | 'imperial';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'super_active' | '';

export interface QuizState {
  gender: Gender;
  goal: Goal;
  unit: Unit;
  age: string;
  height: string;
  weight: string;
  targetWeight: string;
  activityLevel: ActivityLevel;
  direction: number;
}

export interface QuizActions {
  setField: <K extends keyof QuizState>(field: K, value: QuizState[K]) => void;
  setDirection: (direction: number) => void;
  reset: () => void;
}

const initialState: QuizState = {
  gender: '',
  goal: '',
  unit: 'metric',
  age: '',
  height: '',
  weight: '',
  targetWeight: '',
  activityLevel: '',
  direction: 1,
};

export const useQuizStore = create<QuizState & QuizActions>()(
  persist(
    (set) => ({
      ...initialState,
      setField: (field, value) => set((state) => ({ ...state, [field]: value })),
      setDirection: (direction) => set({ direction }),
      reset: () => set(initialState),
    }),
    {
      name: 'quiz-storage',
    }
  )
);

