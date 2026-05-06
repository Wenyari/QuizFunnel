import { Gender, Goal, Unit, ActivityLevel } from '../store/useQuizStore';

export const calculateBMI = (weight: number, height: number, unit: Unit): number => {
  if (weight <= 0 || height <= 0) return 0;
  
  if (unit === 'metric') {
    // weight in kg, height in cm
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  } else {
    // weight in lbs, height in inches
    return (703 * weight) / (height * height);
  }
};

const activityMultipliers: Record<ActivityLevel | '', number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  super_active: 1.9,
  '': 1.2, // fallback
};

export const calculateTargetDate = (
  weightStr: string,
  targetWeightStr: string,
  heightStr: string,
  ageStr: string,
  gender: Gender,
  goal: Goal,
  unit: Unit,
  activityLevel: ActivityLevel
): Date => {
  const weight = parseFloat(weightStr) || 0;
  const targetWeight = parseFloat(targetWeightStr) || 0;
  const height = parseFloat(heightStr) || 0;
  const age = parseFloat(ageStr) || 0;

  if (!weight || !targetWeight || !height || !age || !gender || !goal) {
    // Return a default of 12 weeks if data is incomplete
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 12 * 7);
    return defaultDate;
  }

  // Convert to metric for BMR calculation
  const weightKg = unit === 'metric' ? weight : weight * 0.453592;
  const heightCm = unit === 'metric' ? height : height * 2.54;

  // Mifflin-St Jeor Equation
  let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;

  const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

  // Determine weekly weight change in kg
  // 1 kg of fat is roughly 7700 kcal
  let weeklyChangeKg = 0;
  
  if (goal === 'lose_weight') {
    // Assume a 500 kcal daily deficit (safe standard) -> 3500 kcal/week -> ~0.45 kg/week
    weeklyChangeKg = 3500 / 7700;
  } else if (goal === 'gain_muscle') {
    // Assume a 250 kcal daily surplus -> 1750 kcal/week -> ~0.22 kg/week
    weeklyChangeKg = 1750 / 7700;
  } else {
    // shape_body, just set a fixed time, e.g., 8 weeks for visible change
    weeklyChangeKg = 0; 
  }

  let weeksNeeded = 8; // Default for shape_body

  if (weeklyChangeKg > 0) {
    const targetWeightKg = unit === 'metric' ? targetWeight : targetWeight * 0.453592;
    const weightDiffKg = Math.abs(weightKg - targetWeightKg);
    weeksNeeded = weightDiffKg / weeklyChangeKg;
  }

  // Cap weeks between 4 and 52
  weeksNeeded = Math.max(4, Math.min(weeksNeeded, 52));

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + Math.ceil(weeksNeeded * 7));

  return targetDate;
};
