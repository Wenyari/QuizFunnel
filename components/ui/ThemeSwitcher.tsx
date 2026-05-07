'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuizStore, Theme } from '@/store/useQuizStore';
import { cn } from '@/utils/cn';

const THEMES: { id: Theme; bgClass: string }[] = [
  { id: 'ocean', bgClass: 'bg-blue-500' },
  { id: 'coral', bgClass: 'bg-rose-500' },
  { id: 'mint', bgClass: 'bg-emerald-500' },
];

export function ThemeSwitcher() {
  const currentTheme = useQuizStore((s) => s.theme);
  const setField = useQuizStore((s) => s.setField);

  return (
    <div className="flex gap-2 p-1.5 bg-gray-100/50 backdrop-blur-sm dark:bg-gray-800/50 rounded-full shadow-sm border border-gray-200/50 dark:border-gray-700/50">
      {THEMES.map((t) => {
        const isActive = currentTheme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => {
              setField('theme', t.id);
            }}
            className={cn(
              "relative w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center shrink-0 shadow-sm",
              t.bgClass,
              isActive && "ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900"
            )}
            aria-label={`Switch to ${t.id} theme`}
          >
            {isActive && (
              <motion.div
                layoutId="active-theme-indicator"
                className="w-2 h-2 bg-white rounded-full absolute"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
