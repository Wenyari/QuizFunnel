import { z } from 'zod';

const ageSchema = z
  .number({ invalid_type_error: "Must be a number" })
  .min(16, 'Age must be at least 16')
  .max(100, 'Age must be less than 100');

export const getBodyDataSchema = (unit: 'metric' | 'imperial') => {
  const isMetric = unit === 'metric';

  return z.object({
    age: ageSchema,
    height: z
      .number({ invalid_type_error: "Must be a number" })
      .min(isMetric ? 100 : 40, isMetric ? 'Height must be at least 100cm' : 'Height must be at least 40 inches')
      .max(isMetric ? 250 : 100, isMetric ? 'Height must be less than 250cm' : 'Height must be less than 100 inches'),
    weight: z
      .number({ invalid_type_error: "Must be a number" })
      .min(isMetric ? 25 : 55, isMetric ? 'Weight must be at least 25kg' : 'Weight must be at least 55 lbs')
      .max(isMetric ? 300 : 660, isMetric ? 'Weight must be less than 300kg' : 'Weight must be less than 660 lbs'),
    targetWeight: z
      .number({ invalid_type_error: "Must be a number" })
      .min(isMetric ? 25 : 55, isMetric ? 'Target weight must be at least 25kg' : 'Target weight must be at least 55 lbs')
      .max(isMetric ? 300 : 660, isMetric ? 'Target weight must be less than 300kg' : 'Target weight must be less than 660 lbs'),
  });
};

export const validateField = (field: string, value: string, unit: 'metric' | 'imperial'): string => {
  const num = parseFloat(value);
  if (isNaN(num)) return '';

  const schema = getBodyDataSchema(unit).partial();
  const result = schema.safeParse({ [field]: num });

  if (!result.success) {
    const error = result.error.issues.find(e => e.path.includes(field));
    return error ? `⚠️ ${error.message}` : '';
  }

  return '';
};


