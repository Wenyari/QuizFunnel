'use client';

import React, { useEffect } from 'react';
import { useQuizStore } from '@/store/useQuizStore';

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handlePopState = () => {
      useQuizStore.getState().setDirection(-1);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900">
      {children}
    </div>
  );
}
