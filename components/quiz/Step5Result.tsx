'use client';
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '@/store/useQuizStore';
import { calculateBMI, calculateTargetDate } from '@/utils/calculation';
import { BMIProfileCard } from './BMIProfileCard';
import { TrendChartCard } from './TrendChartCard';
import { PaywallCTA } from './PaywallCTA';
import { SubscriptionModal } from './SubscriptionModal';

export const Step5Result = () => {
  const { weight, targetWeight, height, age, gender, goal, unit, activityLevel } = useQuizStore();
  const [modalOpen, setModalOpen] = useState(false);

  const weightNum = parseFloat(weight) || 60;
  const targetWeightNum = parseFloat(targetWeight) || 55;
  const heightNum = parseFloat(height) || 170;

  const bmi = calculateBMI(weightNum, heightNum, unit);
  const targetDate = useMemo(() => 
    calculateTargetDate(weight, targetWeight, height, age, gender, goal, unit, activityLevel),
  [weight, targetWeight, height, age, gender, goal, unit, activityLevel]);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthStr = `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center w-full pb-40 pt-4 px-2"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-outfit text-gray-800 dark:text-white mb-2">
            Your Personalized Plan is Ready
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
            Estimated to reach your goal by <span className="text-primary font-bold">{monthStr}</span>
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">
          <BMIProfileCard bmi={bmi} />
          <TrendChartCard currentWeight={weightNum} targetWeight={targetWeightNum} weeks={8} />
        </div>

        <PaywallCTA onOpen={() => setModalOpen(true)} />
      </motion.div>

      <SubscriptionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

