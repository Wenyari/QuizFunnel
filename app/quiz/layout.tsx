export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="quiz-layout">
      {/* framer-motion AnimatePresence will go here */}
      {children}
    </div>
  );
}
