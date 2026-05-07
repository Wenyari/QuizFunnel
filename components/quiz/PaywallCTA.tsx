import React from 'react';
import { motion } from 'framer-motion';

interface PaywallCTAProps {
  onOpen?: () => void;
}

export const PaywallCTA = ({ onOpen }: PaywallCTAProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 z-50 flex flex-col items-center pb-8 pt-12">
      <div className="w-full max-w-sm flex flex-col gap-3">
        <p className="text-center text-sm font-bold text-gray-700 dark:text-gray-300">
          Get your custom-tailored plan now
        </p>
        <motion.button
          onClick={onOpen}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-full py-4 rounded-2xl bg-primary text-white font-bold font-outfit text-lg shadow-lg shadow-primary/30 active:scale-95 transition-colors"
        >
          View Full Plan
        </motion.button>
      </div>
    </div>
  );
};
