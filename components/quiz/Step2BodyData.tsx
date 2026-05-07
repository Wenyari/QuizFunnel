'use client';

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { useQuizStore } from '@/store/useQuizStore';
import { getBodyDataSchema } from '@/utils/validation';
import { cn } from '@/utils/cn';

interface BodyDataErrors {
  age?: string;
  height?: string;
  weight?: string;
  targetWeight?: string;
}

/** 暴露给父组件的命令式接口，用于触发校验 */
export interface Step2Ref {
  validate: () => boolean;
}

/**
 * Step2BodyData: 身体数据表单业务组件
 * 职责: 渲染年龄/身高/体重/目标体重输入 + 公制/英制切换 + Zod 校验
 * 通过 forwardRef 暴露 validate() 方法给 page.tsx 的 onBeforeNext 钩子调用
 */
export const Step2BodyData = forwardRef<Step2Ref>(function Step2BodyData(_, ref) {
  const age = useQuizStore((s) => s.age);
  const height = useQuizStore((s) => s.height);
  const weight = useQuizStore((s) => s.weight);
  const targetWeight = useQuizStore((s) => s.targetWeight);
  const unit = useQuizStore((s) => s.unit);
  const setField = useQuizStore((s) => s.setField);

  const [errors, setErrors] = useState<BodyDataErrors>({});

  const validate = (): boolean => {
    const schema = getBodyDataSchema(unit);
    const result = schema.safeParse({
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      targetWeight: Number(targetWeight),
    });
    if (!result.success) {
      const fieldErrors: BodyDataErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof BodyDataErrors;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  // 将 validate 方法通过 ref 暴露给父组件
  useImperativeHandle(ref, () => ({ validate }));

  const isMetric = unit === 'metric';

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 公制 / 英制切换 Toggle */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">单位：</span>
        <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden text-sm">
          {(['metric', 'imperial'] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setField('unit', u)}
              className={cn(
                'px-4 py-2 font-semibold transition-colors',
                unit === u
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              {u === 'metric' ? '公制 (kg / cm)' : '英制 (lbs / in)'}
            </button>
          ))}
        </div>
      </div>

      <Input
        id="input-age"
        label="年龄 (岁)"
        type="number"
        inputMode="numeric"
        placeholder="18–100"
        value={age}
        onChange={(e) => setField('age', e.target.value)}
        onBlur={() => validate()}
        error={errors.age}
      />

      <Input
        id="input-height"
        label={`身高 (${isMetric ? 'cm' : 'in'})`}
        type="number"
        inputMode="decimal"
        placeholder={isMetric ? '120–250 cm' : '48–98 in'}
        value={height}
        onChange={(e) => setField('height', e.target.value)}
        onBlur={() => validate()}
        error={errors.height}
      />

      <Input
        id="input-weight"
        label={`当前体重 (${isMetric ? 'kg' : 'lbs'})`}
        type="number"
        inputMode="decimal"
        placeholder={isMetric ? '35–200 kg' : '75–450 lbs'}
        value={weight}
        onChange={(e) => setField('weight', e.target.value)}
        onBlur={() => validate()}
        error={errors.weight}
      />

      <Input
        id="input-target-weight"
        label={`目标体重 (${isMetric ? 'kg' : 'lbs'})`}
        type="number"
        inputMode="decimal"
        placeholder={isMetric ? '35–200 kg' : '75–450 lbs'}
        value={targetWeight}
        onChange={(e) => setField('targetWeight', e.target.value)}
        onBlur={() => validate()}
        error={errors.targetWeight}
      />
    </div>
  );
});
