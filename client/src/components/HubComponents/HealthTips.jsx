import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const healthInsights = [
  { 
    icon: (
      <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    category: 'Heart Health',
    insight: 'Regular physical activity for just 30 minutes daily can reduce heart disease risk by up to 35%. Simple activities like brisk walking, swimming, or cycling provide significant cardiovascular benefits.',
    evidenceLevel: 'Clinical Evidence',
    color: 'from-red-500 to-pink-500',
    tip: 'Start with 10-minute walks and gradually increase duration'
  },
  { 
    icon: (
      <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    category: 'Sleep Wellness',
    insight: 'Quality sleep between 7-9 hours nightly improves immune function, mental clarity, and emotional regulation. Good sleep hygiene includes consistent bedtime routines and limiting screen exposure.',
    evidenceLevel: 'Sleep Research',
    color: 'from-indigo-500 to-blue-500',
    tip: 'Create a cool, dark environment and avoid caffeine after 2 PM'
  },
  { 
    icon: (
      <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    category: 'Nutrition Balance',
    insight: 'A balanced diet with 5-7 servings of fruits and vegetables daily provides essential nutrients and antioxidants. Whole foods support better digestion, energy levels, and long-term health outcomes.',
    evidenceLevel: 'Nutritional Science',
    color: 'from-emerald-500 to-green-500',
    tip: 'Fill half your plate with colorful vegetables at each meal'
  },
  { 
    icon: (
      <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    category: 'Mental Wellness',
    insight: 'Regular stress management through meditation, deep breathing, or mindfulness practices can lower cortisol levels and improve overall mental health. Even 5-10 minutes daily makes a difference.',
    evidenceLevel: 'Psychology Research',
    color: 'from-teal-500 to-cyan-500',
    tip: 'Try the 4-7-8 breathing technique: inhale 4, hold 7, exhale 8'
  }
];

const HealthTips = () => {
  const titleRef = useRef(null);
  const tipsRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, threshold: 0.5 });
  const tipsInView = useInView(tipsRef, { once: true, threshold: 0.2 });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 30 }}
        animate={titleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-100 rounded-full mb-4 sm:mb-6">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <span className="text-xs sm:text-sm font-medium text-emerald-700">Evidence-Based Wellness</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-slate-800">
          Daily Health
          <br />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Wisdom & Tips
          </span>
        </h2>
        
        <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto px-4">
          Science-backed health insights and practical wellness tips for better living every day
        </p>
      </motion.div>

      <div ref={tipsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {healthInsights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={tipsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            className="group relative h-full" // Added h-full for equal height
          >
            {/* Hover Glow Effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${insight.color} rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}></div>
            
            {/* Card Content - Full height with flex layout */}
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:bg-white hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6 flex-shrink-0">
                <div className={`p-2 sm:p-3 bg-gradient-to-r ${insight.color} rounded-lg sm:rounded-xl text-white shadow-lg flex-shrink-0`}>
                  {insight.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1 sm:mb-2">
                    {insight.category}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {insight.evidenceLevel}
                  </span>
                </div>
              </div>

              {/* Insight Content - Flex grow */}
              <div className="flex-grow">
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                  {insight.insight}
                </p>

                {/* Practical Tip */}
                <div className="bg-slate-50 rounded-lg p-3 sm:p-4 mb-4">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800 mb-2">💡 Quick Tip:</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {insight.tip}
                  </p>
                </div>
              </div>

              {/* Footer - Always at bottom */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 flex-shrink-0">
                <span className="text-xs sm:text-sm text-slate-500">
                  Medically reviewed
                </span>
                
                <button className="text-xs sm:text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                  Read more
                  <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HealthTips;
