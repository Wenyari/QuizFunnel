

export type StepType = 'single_choice' | 'body_data' | 'analysis' | 'result';

export interface QuizOption {
  label: string;
  value: string;
  icon?: string;
}

export interface QuizStep {
  id: string;
  type: StepType;
  title: string;
  subtitle?: string;
  field?: string; // store field to update, e.g. 'gender', 'goal'
  options?: QuizOption[];
  nextStep?: string;
  prevStep?: string;
}

export const quizFlow: QuizStep[] = [
  {
    id: '1',
    type: 'single_choice',
    title: '基础信息',
    subtitle: '请选择您的性别',
    field: 'gender',
    options: [
      { label: '男性', value: 'male' },
      { label: '女性', value: 'female' },
    ],
    nextStep: '2',
  },
  {
    id: '2',
    type: 'body_data',
    title: '身体数据',
    subtitle: '请输入您的身体数据以便进行更准确的计算',
    prevStep: '1',
    nextStep: '3',
  },
  {
    id: '3',
    type: 'single_choice',
    title: '活动频率',
    subtitle: '您平时的活动量是怎样的？',
    field: 'activityLevel',
    options: [
      { label: '久坐不动', value: 'sedentary' },
      { label: '轻度活动', value: 'lightly_active' },
      { label: '中度活动', value: 'moderately_active' },
      { label: '重度活动', value: 'very_active' },
      { label: '极度活跃', value: 'super_active' },
    ],
    prevStep: '2',
    nextStep: '4', // next step would be analysis
  }
];

export const getStepConfig = (id: string) => quizFlow.find(step => step.id === id);
