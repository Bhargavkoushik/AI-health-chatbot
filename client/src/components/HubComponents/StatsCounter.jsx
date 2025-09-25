import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

const stats = [
  { 
    label: 'Health Topics', 
    value: 50, 
    suffix: '+',
    icon: (
      <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'from-teal-500 to-emerald-500'
  },
  { 
    label: 'Medical Resources', 
    value: 25, 
    suffix: '+',
    icon: (
      <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    color: 'from-cyan-500 to-blue-500'
  },
  { 
    label: 'Global Health Data', 
    value: 195, 
    suffix: ' Countries',
    icon: (
      <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-emerald-500 to-green-500'
  },
  { 
    label: 'Reliability', 
    value: 99.9, 
    suffix: '%',
    icon: (
      <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'from-blue-500 to-indigo-500'
  }
];

const AnimatedCounter = ({ value, suffix, duration = 2000 }) => {
  const count = useMotionValue(0);
  const rounded = useSpring(count, { stiffness: 100, damping: 30 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.onChange((latest) => {
      setDisplayValue(Math.round(latest * 10) / 10);
    });
    
    count.set(value);
    
    return unsubscribe;
  }, [count, value, rounded]);

  return <span>{displayValue}{suffix}</span>;
};

const StatsCounter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 sm:mb-20"
    >
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ 
                delay: index * 0.15, 
                type: 'spring', 
                stiffness: 200, 
                damping: 20,
                duration: 0.8 
              }}
              className="relative group"
            >
              {/* Background Glow */}
              <div className={`absolute -inset-1 sm:-inset-2 bg-gradient-to-r ${stat.color} rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
              
              {/* Card Content */}
              <div className="relative bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:bg-white/70 transition-all duration-300">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r ${stat.color} rounded-lg sm:rounded-xl text-white mb-3 sm:mb-4 shadow-lg`}>
                  {stat.icon}
                </div>

                {/* Value */}
                <div className={`text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 sm:mb-2`}>
                  {isInView && <AnimatedCounter value={stat.value} suffix={stat.suffix} />}
                </div>

                {/* Label */}
                <div className="text-slate-600 font-medium text-xs sm:text-sm lg:text-base leading-tight">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCounter;
