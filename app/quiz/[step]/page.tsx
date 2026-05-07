import { getStepConfig } from '@/config/quizFlow';
import { redirect } from 'next/navigation';
import NavigationButtons from './NavigationButtons';

export default async function StepPage({ params }: { params: Promise<{ step: string }> }) {
  const resolvedParams = await params;
  const stepConfig = getStepConfig(resolvedParams.step);

  if (!stepConfig) {
    redirect('/quiz/1'); // 重定向到起点
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
        {stepConfig.title}
      </h1>
      {stepConfig.subtitle && (
        <p className="text-base font-medium text-gray-500 mb-8">
          {stepConfig.subtitle}
        </p>
      )}

      {/* 假组件充当 Step 内容，用于测试流转 */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8">
        <p className="text-gray-500 font-medium">Step ID: {stepConfig.id}</p>
        <p className="text-gray-500 font-medium">Type: {stepConfig.type}</p>
        <p className="text-gray-400 text-sm mt-4 text-center">
          (纯文本组件，用于测试连通性与动画)
        </p>
      </div>

      <NavigationButtons prevStep={stepConfig.prevStep} nextStep={stepConfig.nextStep} />
    </div>
  );
}
