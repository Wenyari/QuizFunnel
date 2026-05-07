import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
  value: number; // 0 to 100
  segments?: number | number[];
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, segments, className }) => {
  // Ensure value stays between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  const segmentsArray = Array.isArray(segments)
    ? segments
    : Array.from({ length: segments || 1 }).map(() => 1);
  const totalWeight = segmentsArray.reduce((acc, val) => acc + val, 0);

  if (segmentsArray.length > 1) {
    let accumulatedWeight = 0;
    return (
      <div className={cn("w-full flex gap-2", className)}>
        {segmentsArray.map((weight, i) => {
          const segmentStart = (accumulatedWeight / totalWeight) * 100;
          accumulatedWeight += weight;
          const segmentEnd = (accumulatedWeight / totalWeight) * 100;
          
          let fillPercent = 0;
          if (clampedValue >= segmentEnd) fillPercent = 100;
          else if (clampedValue > segmentStart) {
            fillPercent = ((clampedValue - segmentStart) / (segmentEnd - segmentStart)) * 100;
          }

          const flexBasis = `${(weight / totalWeight) * 100}%`;

          return (
            <div key={i} style={{ flexBasis }} className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${fillPercent}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden", className)}>
      <motion.div
        className="h-full bg-primary rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${clampedValue}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
};

