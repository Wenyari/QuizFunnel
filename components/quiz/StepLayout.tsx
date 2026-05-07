import React from 'react';

interface StepLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/**
 * StepLayout: 每个 Step 共用的标题 + 副标题排版层
 * 无状态组件，纯布局职责，由 page.tsx 传入标题数据
 */
export function StepLayout({ title, subtitle, children }: StepLayoutProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base font-medium text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
