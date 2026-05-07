import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="text-center flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
          健康测评获客漏斗
        </h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          定制您的专属健康与健身计划，只需 1 分钟即可获取个性化报告。
        </p>
        <Link 
          href="/quiz"
          className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-transform"
        >
          开始测试
        </Link>
      </div>
    </div>
  );
}
