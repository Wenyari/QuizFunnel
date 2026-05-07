'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tier {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  tag?: string;
  tagColor?: string;
  features: string[];
  recommended?: boolean;
}

const TIERS: Tier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$9.9',
    features: [
      'Personalized daily meal plan',
      'Basic workout routines (3 options)',
      'Weekly progress summaries',
      'Community Q&A support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19.9',
    originalPrice: '$39.9',
    discount: '50% OFF',
    tag: 'MOST POPULAR',
    tagColor: 'bg-primary text-white',
    recommended: true,
    features: [
      'Everything in Starter',
      'AI-driven real-time weight forecast',
      'Daily macronutrient precision (P/C/F)',
      'Customized workout strategy',
      'Priority customer support',
      'Regular body measurement tracking',
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    price: '$39.9',
    features: [
      'Everything in Pro',
      '2x monthly 1-on-1 video coaching',
      'In-depth body composition analysis',
      'Hormone & nutrition synchronization',
      'Sleep & recovery optimization',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '$79.9',
    tag: 'EXCLUSIVE',
    tagColor: 'bg-amber-500 text-white',
    features: [
      'Everything in Advanced',
      'Dedicated nutritionist (Unlimited)',
      'DNA body type interpretation',
      'Genetic-based workout adjustments',
      'Precision supplement timing',
      'Annual personal health archives',
    ],
  },
];

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal = ({ isOpen, onClose }: SubscriptionModalProps) => {
  const [selected, setSelected] = useState<string>('pro');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl max-h-[92vh] flex flex-col"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pt-3 pb-4 shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold font-outfit text-gray-900 dark:text-white">Choose Your Plan</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Cancel anytime. No commitment.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tier Cards (Scrollable) */}
            <div className="overflow-y-auto flex-1 px-5 pb-4 space-y-3">
              {TIERS.map((tier) => {
                const isSelected = selected === tier.id;
                const isRecommended = tier.recommended;
                return (
                  <motion.div
                    key={tier.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected(tier.id)}
                    className={`relative rounded-2xl p-4 cursor-pointer transition-all duration-200 ${
                      isRecommended
                        ? 'border-2 border-primary shadow-md shadow-primary/15'
                        : isSelected
                        ? 'border-2 border-gray-400 dark:border-gray-500'
                        : 'border-2 border-gray-100 dark:border-gray-800'
                    } ${isRecommended ? 'bg-primary/5 dark:bg-primary/10' : 'bg-white dark:bg-gray-800'}`}
                  >
                    {/* Recommended Badge */}
                    {tier.tag && (
                      <span className={`absolute -top-3 left-4 text-xs font-bold px-2.5 py-1 rounded-full ${tier.tagColor} shadow-sm`}>
                        {tier.tag}
                      </span>
                    )}

                    <div className="flex items-start justify-between gap-3">
                      {/* Left: Name + Features */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-base font-extrabold ${isRecommended ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>
                            {tier.name}
                          </span>
                          {isRecommended && (
                            <span className="text-[10px] font-bold text-primary border border-primary/30 rounded-full px-2 py-0.5">
                              {tier.discount}
                            </span>
                          )}
                        </div>
                        <ul className="space-y-1">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <span className={`mt-0.5 shrink-0 ${isRecommended ? 'text-primary' : 'text-gray-400'}`}>✓</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right: Price + Radio */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="text-right">
                          {tier.originalPrice && (
                            <div className="text-xs text-gray-400 line-through leading-none mb-0.5">{tier.originalPrice}</div>
                          )}
                          <div className={`text-xl font-extrabold tabular-nums leading-none ${isRecommended ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>
                            {tier.price}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">/mo</div>
                        </div>

                        {/* Radio indicator */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-primary bg-primary'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                className="w-2 h-2 rounded-full bg-white"
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Footer */}
            <div className="px-5 pb-10 pt-3 shrink-0 border-t border-gray-100 dark:border-gray-800">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/25 tracking-wide"
              >
                Start Now —{' '}
                {TIERS.find((t) => t.id === selected)?.price}/mo
              </motion.button>
              <p className="text-center text-xs text-gray-400 mt-2">Secure Payment · Cancel Anytime · 7-Day Money-Back Guarantee</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
