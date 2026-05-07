import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="text-center flex flex-col items-center p-6">
        <h1 className="text-4xl font-bold font-outfit mb-4 text-gray-900 dark:text-white tracking-tight">
          Personalized Health Quiz
        </h1>
        <p className="text-gray-500 mb-8 max-w-sm text-lg">
          Tailor your personalized health and fitness plan. Get your custom report in just 1 minute.
        </p>
        <Link 
          href="/quiz"
          className="px-10 py-4 bg-primary text-white rounded-full font-bold font-outfit text-lg hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/25"
        >
          Start Quiz
        </Link>
      </div>
    </div>
  );
}
