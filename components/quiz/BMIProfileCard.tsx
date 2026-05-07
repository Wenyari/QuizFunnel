import React from 'react';
import { motion } from 'framer-motion';

export const BMIProfileCard = ({ bmi }: { bmi: number }) => {
  // BMI scale map: 15 → 0%, 35 → 100%
  const minBmi = 15;
  const maxBmi = 35;
  let percent = ((bmi - minBmi) / (maxBmi - minBmi)) * 100;
  percent = Math.max(0, Math.min(100, percent));

  let status = 'Normal';
  let statusColor = 'text-green-500';
  if (bmi < 18.5) { status = 'Underweight'; statusColor = 'text-blue-500'; }
  else if (bmi >= 25 && bmi < 30) { status = 'Overweight'; statusColor = 'text-yellow-500'; }
  else if (bmi >= 30) { status = 'Obese'; statusColor = 'text-red-500'; }

  // X-axis ticks: reference BMI thresholds + min/max
  const ticks = [15, 18.5, 25, 30, 35];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 w-full mb-2">
      <h3 className="text-gray-500 dark:text-gray-400 font-semibold text-sm uppercase tracking-wider mb-4">Health Assessment</h3>
      <div className="flex items-end gap-3 mb-6">
        <span className="text-4xl font-bold font-outfit text-gray-800 dark:text-white tabular-nums leading-none">
          {bmi.toFixed(1)}
        </span>
        <span className={`text-xl font-bold ${statusColor} leading-none mb-1`}>
          {status}
        </span>
      </div>

      {/* Chart container with white inset shadow */}
      <div
        className="rounded-2xl px-4 pt-5 pb-2"
        style={{
          background: '#ffffff',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.08), inset 0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        {/* Y-axis label */}
        <div className="text-[10px] font-semibold text-gray-400 mb-3 tracking-wider uppercase">BMI Index</div>

        {/* Bar with relative container for vertical gridlines */}
        <div className="relative">
          {/* Vertical gridlines at threshold points */}
          {ticks.map((t) => {
            const pos = ((t - minBmi) / (maxBmi - minBmi)) * 100;
            return (
              <div
                key={t}
                className="absolute top-0 bottom-0 border-l border-dashed border-gray-200 dark:border-gray-600"
                style={{ left: `${pos}%`, height: '28px' }}
              />
            );
          })}

          {/* The gradient bar */}
          <div className="relative h-5 rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500 shadow-inner overflow-visible">
            {/* Indicator dot: white circle with gray transparent border */}
            <motion.div
              initial={{ left: '0%' }}
              animate={{ left: `${percent}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.5 }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full z-10"
              style={{
                border: '4px solid rgba(214, 212, 212, 0.9)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              }}
            />
          </div>
        </div>

        {/* X-axis ticks */}
        <div className="relative mt-2 h-5">
          {ticks.map((t) => {
            const pos = ((t - minBmi) / (maxBmi - minBmi)) * 100;
            return (
              <div
                key={t}
                className="absolute flex flex-col items-center"
                style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-px h-1.5 bg-gray-300 dark:bg-gray-600 mb-0.5" />
                <span className="text-[9px] font-bold text-gray-400 tabular-nums whitespace-nowrap">{t}</span>
              </div>
            );
          })}
        </div>

        {/* X-axis line */}
        <div className="h-px bg-gray-200 dark:bg-gray-700 mt-1 mb-1 mx-0" />

        {/* Zone labels row */}
        <div className="flex text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1 mb-1">
          <span style={{ flex: '3.5 1 0%' }}>Underweight</span>
          <span style={{ flex: '6.5 1 0%' }}>Normal</span>
          <span style={{ flex: '5 1 0%' }}>Overweight</span>
          <span style={{ flex: '5 1 0%' }}>Obese</span>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mt-5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border border-gray-100 dark:border-gray-700">
        <span className="font-bold text-gray-700 dark:text-gray-300">What is BMI?</span> Body Mass Index (BMI) is an internationally recognized measure used to assess whether a person has a healthy body weight relative to their height. Formula: weight (kg) ÷ height² (m).
      </div>
    </div>
  );
};

