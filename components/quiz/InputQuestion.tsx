'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore, Unit } from '@/store/useQuizStore';
import { calculateBMI } from '@/utils/calculation';
import { cn } from '@/utils/cn';

interface InputQuestionProps {
  field: 'age' | 'height' | 'weight' | 'targetWeight';
}

export const InputQuestion: React.FC<InputQuestionProps> = ({ field }) => {
  const value = useQuizStore((s) => s[field] as string);
  const heightStr = useQuizStore((s) => s.height);
  const weightStr = useQuizStore((s) => s.weight);
  const targetWeightStr = useQuizStore((s) => s.targetWeight);
  const unit = useQuizStore((s) => s.unit);
  const setField = useQuizStore((s) => s.setField);
  
  // Handle unit toggle and auto-conversion for all dependent fields
  const toggleUnit = () => {
    const newUnit: Unit = unit === 'metric' ? 'imperial' : 'metric';
    
    const h = parseFloat(heightStr);
    if (!isNaN(h) && h > 0) {
      const converted = newUnit === 'metric' ? h * 2.54 : h / 2.54;
      setField('height', converted.toFixed(1).replace(/\.0$/, ''));
    }

    const w = parseFloat(weightStr);
    if (!isNaN(w) && w > 0) {
      const converted = newUnit === 'metric' ? w / 2.20462 : w * 2.20462;
      setField('weight', converted.toFixed(1).replace(/\.0$/, ''));
    }

    const tw = parseFloat(targetWeightStr);
    if (!isNaN(tw) && tw > 0) {
      const converted = newUnit === 'metric' ? tw / 2.20462 : tw * 2.20462;
      setField('targetWeight', converted.toFixed(1).replace(/\.0$/, ''));
    }

    setField('unit', newUnit);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and a single decimal point
    const val = e.target.value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = val.split('.');
    let cleanVal = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : val;
    
    // For age, strip decimals completely
    if (field === 'age') {
      cleanVal = cleanVal.replace(/\./g, '');
    }

    setField(field, cleanVal);
  };

  // Real-time BMI calculation and warning
  let warningMessage = '';
  if (field === 'weight' || field === 'targetWeight') {
    const w = parseFloat(value);
    const h = parseFloat(heightStr);
    if (!isNaN(w) && w > 0 && !isNaN(h) && h > 0) {
      const bmi = calculateBMI(w, h, unit);
      if (bmi < 18.5) {
        warningMessage = `⚠️ 当前 BMI 为 ${bmi.toFixed(1)}，低于正常范围 (18.5 - 24.9)。`;
      } else if (bmi >= 25) {
        warningMessage = `⚠️ 当前 BMI 为 ${bmi.toFixed(1)}，超出正常范围 (18.5 - 24.9)。`;
      }
    }
  }

  let unitLabel = '';
  let showToggle = false;
  if (field === 'age') {
    unitLabel = '岁';
    showToggle = false;
  } else if (field === 'height') {
    unitLabel = unit === 'metric' ? 'cm' : 'in';
    showToggle = true;
  } else {
    unitLabel = unit === 'metric' ? 'kg' : 'lbs';
    showToggle = true;
  }

  return (
    <div className="w-full mt-4 flex flex-col items-center">
      <div className="relative w-full max-w-sm">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          className={cn(
            "flex h-16 w-full rounded-2xl border-2 bg-white px-6 py-4 pr-24 text-2xl font-bold placeholder:text-gray-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            warningMessage ? "border-red-400" : "border-gray-200 focus:border-gray-300"
          )}
          placeholder="请输入数值"
        />
        {showToggle ? (
          <button
            type="button"
            onClick={toggleUnit}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-primary font-semibold transition-colors border border-gray-200"
          >
            <span className="text-lg">{unitLabel}</span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        ) : (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center">
             <span className="text-lg font-semibold text-gray-500">{unitLabel}</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {warningMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-4 rounded-xl bg-red-50 text-sm text-red-600 font-medium w-full max-w-sm border border-red-100"
          >
            {warningMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
