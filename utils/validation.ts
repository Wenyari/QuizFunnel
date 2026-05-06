import { z } from 'zod';

const ageSchema = z
  .number({ invalid_type_error: "Must be a number" })
  .min(18, 'Age must be at least 18')
  .max(100, 'Age must be less than 100');

export const getBodyDataSchema = (unit: 'metric' | 'imperial') => {
  const isMetric = unit === 'metric';

  return z.object({
    age: ageSchema,
    height: z
      .number({ invalid_type_error: "Must be a number" })
      .min(isMetric ? 120 : 48, isMetric ? 'Height must be at least 120cm' : 'Height must be at least 48 inches')
      .max(isMetric ? 250 : 98, isMetric ? 'Height must be less than 250cm' : 'Height must be less than 98 inches'),
    weight: z
      .number({ invalid_type_error: "Must be a number" })
      .min(isMetric ? 35 : 75, isMetric ? 'Weight must be at least 35kg' : 'Weight must be at least 75 lbs')
      .max(isMetric ? 200 : 450, isMetric ? 'Weight must be less than 200kg' : 'Weight must be less than 450 lbs'),
    targetWeight: z
      .number({ invalid_type_error: "Must be a number" })
      .min(isMetric ? 35 : 75, isMetric ? 'Target weight must be at least 35kg' : 'Target weight must be at least 75 lbs')
      .max(isMetric ? 200 : 450, isMetric ? 'Target weight must be less than 200kg' : 'Target weight must be less than 450 lbs'),
  }).refine((data) => {
    // Optionally we can add a check like target weight shouldn't be exactly same as weight, but depends on goal.
    return true; 
  });
};

