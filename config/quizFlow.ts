
export type StepType = 'single_choice' | 'analysis' | 'result' | 'input';

export interface QuizOption {
  label: string;
  /** 存储的数值（用于计算 BMI 等），或枚举值 */
  value: string;
  emoji?: string;
}

/** 动态 options 生成所需的上下文（避免循环依赖，不直接引入 QuizState） */
export interface StepContext {
  unit: 'metric' | 'imperial';
  height: string;
  weight: string;
  goal: string;
}

export interface QuizStep {
  id: string;
  type: StepType;
  title: string;
  subtitle?: string;
  /** 关联的 Zustand Store 字段 */
  field?: string;
  /** 静态选项（gender / goal / unit / activity 等） */
  options?: QuizOption[];
  /** 动态选项生成器（身高/体重/目标体重，依赖 unit 或 height） */
  dynamicOptions?: (ctx: StepContext) => QuizOption[];
  /** 动态副标题生成器（目标体重步骤显示健康范围提示） */
  dynamicSubtitle?: (ctx: StepContext) => string;
  nextStep?: string;
  prevStep?: string;
}

// ─────────────────────────────────────────────
// 选项生成辅助函数
// ─────────────────────────────────────────────

function getHeightOptions(unit: 'metric' | 'imperial'): QuizOption[] {
  if (unit === 'metric') {
    return [
      { label: '155 cm 以下', value: '152', emoji: '📏' },
      { label: '155 – 160 cm', value: '157', emoji: '📏' },
      { label: '161 – 165 cm', value: '163', emoji: '📏' },
      { label: '166 – 170 cm', value: '168', emoji: '📏' },
      { label: '171 – 175 cm', value: '173', emoji: '📏' },
      { label: '176 – 180 cm', value: '178', emoji: '📏' },
      { label: '181 – 185 cm', value: '183', emoji: '📏' },
      { label: '186 cm 以上', value: '188', emoji: '📏' },
    ];
  }
  return [
    { label: '4\'11" 以下 (≤59")', value: '58', emoji: '📏' },
    { label: '5\'0" – 5\'2" (60–62")', value: '61', emoji: '📏' },
    { label: '5\'3" – 5\'5" (63–65")', value: '64', emoji: '📏' },
    { label: '5\'6" – 5\'8" (66–68")', value: '67', emoji: '📏' },
    { label: '5\'9" – 5\'11" (69–71")', value: '70', emoji: '📏' },
    { label: '6\'0" – 6\'2" (72–74")', value: '73', emoji: '📏' },
    { label: '6\'3" 以上 (≥75")', value: '76', emoji: '📏' },
  ];
}

function getWeightOptions(unit: 'metric' | 'imperial'): QuizOption[] {
  if (unit === 'metric') {
    return [
      { label: '50 kg 以下', value: '45' },
      { label: '50 – 60 kg', value: '55' },
      { label: '61 – 70 kg', value: '65' },
      { label: '71 – 80 kg', value: '75' },
      { label: '81 – 90 kg', value: '85' },
      { label: '91 – 100 kg', value: '95' },
      { label: '101 – 115 kg', value: '108' },
      { label: '115 kg 以上', value: '122' },
    ];
  }
  return [
    { label: '110 lbs 以下', value: '100' },
    { label: '110 – 130 lbs', value: '120' },
    { label: '131 – 150 lbs', value: '140' },
    { label: '151 – 170 lbs', value: '160' },
    { label: '171 – 190 lbs', value: '180' },
    { label: '191 – 210 lbs', value: '200' },
    { label: '211 – 230 lbs', value: '220' },
    { label: '230 lbs 以上', value: '245' },
  ];
}

/**
 * 目标体重选项：根据身高和 BMI 17–32 范围过滤
 * 转换为公斤进行 BMI 计算：BMI = kg / m²（或 lbs × 703 / in²）
 */
function getTargetWeightOptions(ctx: StepContext): QuizOption[] {
  const allOptions = getWeightOptions(ctx.unit);
  const heightNum = Number(ctx.height);
  if (!heightNum) return allOptions;

  const MIN_BMI = 17;
  const MAX_BMI = 32;

  const toKg = (value: string) =>
    ctx.unit === 'metric' ? Number(value) : Number(value) * 0.453592;

  const bmi = (weightKg: number) => {
    const heightM =
      ctx.unit === 'metric' ? heightNum / 100 : heightNum * 0.0254;
    return weightKg / (heightM * heightM);
  };

  return allOptions.filter((opt) => {
    const kg = toKg(opt.value);
    const b = bmi(kg);
    return b >= MIN_BMI && b <= MAX_BMI;
  });
}

function getTargetWeightSubtitle(ctx: StepContext): string {
  const heightNum = Number(ctx.height);
  if (!heightNum) return 'Enter your target weight';

  const heightM =
    ctx.unit === 'metric' ? heightNum / 100 : heightNum * 0.0254;
  const minKg = 18.5 * heightM * heightM;
  const maxKg = 24.9 * heightM * heightM;

  if (ctx.unit === 'metric') {
    return `Based on your height, a healthy weight range is approx. ${Math.round(minKg)}–${Math.round(maxKg)} kg`;
  }
  const minLbs = minKg / 0.453592;
  const maxLbs = maxKg / 0.453592;
  return `Based on your height, a healthy weight range is approx. ${Math.round(minLbs)}–${Math.round(maxLbs)} lbs`;
}

// ─────────────────────────────────────────────
// 完整问卷流程定义
// ─────────────────────────────────────────────

export const quizFlow: QuizStep[] = [
  // ── Step 1a: Gender ──────────────────────────
  {
    id: 'gender',
    type: 'single_choice',
    title: 'What is your gender?',
    subtitle: 'Helps us build a more accurate health profile for you',
    field: 'gender',
    options: [
      { label: 'Male', value: 'male', emoji: '♂️' },
      { label: 'Female', value: 'female', emoji: '♀️' },
    ],
    nextStep: 'goal',
  },

  // ── Step 1b: Fitness goal ──────────────────────
  {
    id: 'goal',
    type: 'single_choice',
    title: 'What is your fitness goal?',
    subtitle: "We'll tailor your training and nutrition plan accordingly",
    field: 'goal',
    options: [
      { label: 'Lose Weight', value: 'lose_weight', emoji: '🔥' },
      { label: 'Build Muscle', value: 'gain_muscle', emoji: '💪' },
      { label: 'Stay in Shape', value: 'shape_body', emoji: '⚖️' },
    ],
    prevStep: 'gender',
    nextStep: 'age',
  },



  // ── Step 2b: Age ──────────────────────────
  {
    id: 'age',
    type: 'input',
    title: 'How old are you?',
    subtitle: 'Metabolism and training strategies differ across age groups',
    field: 'age',
    prevStep: 'goal',
    nextStep: 'height',
  },

  // ── Step 2c: Height ──────────────────────────
  {
    id: 'height',
    type: 'input',
    title: 'What is your height?',
    subtitle: 'Used to calculate your Basal Metabolic Rate (BMR) and ideal weight',
    field: 'height',
    prevStep: 'age',
    nextStep: 'weight',
  },

  // ── Step 2d: Current weight ──────────────────────
  {
    id: 'weight',
    type: 'input',
    title: 'What is your current weight?',
    subtitle: 'Your data is private and used only to build your personalized plan',
    field: 'weight',
    prevStep: 'height',
    nextStep: 'targetWeight',
  },

  // ── Step 2e: Target weight ──────────────────────
  {
    id: 'targetWeight',
    type: 'input',
    title: 'What is your target weight?',
    field: 'targetWeight',
    dynamicSubtitle: getTargetWeightSubtitle,
    prevStep: 'weight',
    nextStep: 'activity',
  },

  // ── Step 3: Activity level ────────────────────────
  {
    id: 'activity',
    type: 'single_choice',
    title: 'How active are you?',
    subtitle: 'This helps us calculate your Total Daily Energy Expenditure (TDEE)',
    field: 'activityLevel',
    options: [
      { label: 'Sedentary (desk job, little exercise)', value: 'sedentary', emoji: '🛋️' },
      { label: 'Light (1–2 workouts/week)', value: 'lightly_active', emoji: '🚶' },
      { label: 'Moderate (3–5 workouts/week)', value: 'moderately_active', emoji: '🏃' },
      { label: 'Active (6–7 intense sessions/week)', value: 'very_active', emoji: '🏋️' },
      { label: 'Very Active (intense daily training or physical job)', value: 'super_active', emoji: '⚡' },
    ],
    prevStep: 'targetWeight',
    nextStep: 'analysis',
  },

  // ── Step 4: Analysis loading (auto-advance) ───────────
  {
    id: 'analysis',
    type: 'analysis',
    title: 'Generating your personalized plan...',
    nextStep: 'result',
  },

  // ── Step 5: Result & Paywall ───────────
  {
    id: 'result',
    type: 'result',
    title: 'Your Personalized Health Plan is Ready',
  },
];

export const getStepConfig = (id: string): QuizStep | undefined =>
  quizFlow.find((step) => step.id === id);

/** 用于计算进度条（分析/结果页不计入可见步骤） */
export const userFacingSteps = quizFlow.filter(
  (s) => s.type !== 'analysis' && s.type !== 'result'
);
