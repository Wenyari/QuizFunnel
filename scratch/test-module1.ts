import { getBodyDataSchema } from '../utils/validation';
import { calculateBMI, calculateTargetDate } from '../utils/calculation';

console.log("=== Testing Validation ===");
const metricSchema = getBodyDataSchema('metric');
const imperialSchema = getBodyDataSchema('imperial');

console.log("Valid metric data:", metricSchema.safeParse({ age: 25, height: 175, weight: 70, targetWeight: 65 }).success); // Expected: true
console.log("Invalid metric weight:", metricSchema.safeParse({ age: 25, height: 175, weight: 20, targetWeight: 65 }).success); // Expected: false

console.log("Valid imperial data:", imperialSchema.safeParse({ age: 25, height: 70, weight: 150, targetWeight: 140 }).success); // Expected: true

console.log("\n=== Testing BMI ===");
console.log("Metric BMI (70kg, 175cm):", calculateBMI(70, 175, 'metric').toFixed(2)); // ~22.86
console.log("Imperial BMI (150lbs, 70in):", calculateBMI(150, 70, 'imperial').toFixed(2)); // ~21.52

console.log("\n=== Testing Target Date ===");
const targetDate = calculateTargetDate('70', '65', '175', '25', 'male', 'lose_weight', 'metric', 'moderately_active');
console.log("Target Date to lose 5kg (70->65) moderately active:", targetDate.toLocaleDateString());
