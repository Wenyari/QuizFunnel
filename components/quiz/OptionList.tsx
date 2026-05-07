'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { QuizOption } from '@/config/quizFlow';

interface OptionListProps {
  options: QuizOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  /** 选中后自动触发下一步（单选问题标准体验），默认 false */
  autoNext?: boolean;
  onAutoNext?: () => void;
}

/**
 * OptionList: 渲染单选卡片列表
 * 支持 emoji 图标、选中高亮、动画打勾及 autoNext 模式
 */
export function OptionList({
  options,
  selectedValue,
  onSelect,
  autoNext = false,
  onAutoNext,
}: OptionListProps) {
  const handleSelect = (value: string) => {
    onSelect(value);
    if (autoNext && onAutoNext) {
      // 短暂延迟让选中高亮和动画打勾可见后再跳转
      setTimeout(onAutoNext, 300);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <Card
            key={option.value}
            selected={isSelected}
            onClick={() => handleSelect(option.value)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                {option.emoji && (
                  <span className="text-2xl leading-none">{option.emoji}</span>
                )}
                <span className="text-base font-semibold text-gray-800 dark:text-gray-100">
                  {option.label}
                </span>
              </div>
              
              {/* Checkbox Animation */}
              <div 
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200 ${
                  isSelected 
                    ? 'border-primary bg-primary' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.svg
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
