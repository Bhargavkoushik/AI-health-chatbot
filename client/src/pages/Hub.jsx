import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import StatsCounter from '../components/HubComponents/StatsCounter';
import MainHubGrid from '../components/HubComponents/MainHubGrid';
import FeaturedCarousel from '../components/HubComponents/FeaturedCarousel';
import HealthTips from '../components/HubComponents/HealthTips';
import NewsletterSignup from '../components/HubComponents/NewsletterSignup';

const Hub = () => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const headerY = useTransform(scrollY, [0, 300], [0, -50]);

  // Fix auto-scroll bug
  useEffect(() => {
    window.scrollTo(0, 0);
    // Prevent scroll anchoring
    document.documentElement.style.overflowAnchor = 'none';
    document.body.style.overflowAnchor = 'none';
    
    return () => {
      document.documentElement.style.overflowAnchor = '';
      document.body.style.overflowAnchor = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 text-slate-800 overflow-x-hidden">
      {/* Medical-themed Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute top-20 right-4 sm:right-10 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-r from-teal-100/40 to-cyan-100/40 rounded-full blur-2xl"
        />
        <motion.div
          style={{ y: backgroundY, rotate: scrollY }}
          className="absolute top-1/3 left-4 sm:left-10 w-24 sm:w-48 h-24 sm:h-48 bg-gradient-to-r from-emerald-100/30 to-green-100/30 rounded-full blur-xl"
        />
        <motion.div
          style={{ y: backgroundY }}
          className="absolute bottom-1/3 right-1/4 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-r from-blue-100/25 to-indigo-100/25 rounded-full blur-3xl"
        />
        
        {/* Medical Cross Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-3 sm:w-6 h-10 sm:h-20 bg-teal-600 rounded-full"></div>
          <div className="absolute top-1/3 left-1/4 w-10 sm:w-20 h-3 sm:h-6 bg-teal-600 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/3 w-2 sm:w-4 h-8 sm:h-16 bg-emerald-600 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/3 w-8 sm:w-16 h-2 sm:h-4 bg-emerald-600 rounded-full"></div>
        </div>
      </div>

      {/* Hero Section */}
      <motion.header
        style={{ opacity: headerOpacity, y: headerY }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 pt-16 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-full mb-4 sm:mb-6">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-teal-700">Health Knowledge Platform</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                MediCore
              </span>
              <br />
              <span className="text-slate-700 text-2xl sm:text-4xl lg:text-5xl font-light">
                Health Knowledge Hub
              </span>
            </h1>
            
            <p className="text-base sm:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light px-4">
              Comprehensive health knowledge platform providing reliable medical information, 
              health advice, wellness tips, and the latest healthcare insights for informed health decisions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
          >
            <button className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span className="flex items-center justify-center gap-2">
                Explore Health Topics
                <svg className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-sm text-teal-700 rounded-xl font-semibold text-base sm:text-lg border border-teal-200 hover:bg-white hover:shadow-lg transition-all duration-300">
              Health Library
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* Stats Counter Section */}
      <div className="relative z-10">
        <StatsCounter />
      </div>

      {/* Main Hub Grid */}
      <div className="relative z-10 py-12 sm:py-20">
        <MainHubGrid />
      </div>

      {/* Featured Carousel */}
      <div className="relative z-10 py-12 sm:py-20 bg-white/40 backdrop-blur-sm">
        <FeaturedCarousel />
      </div>

      {/* Health Tips Section */}
      <div className="relative z-10 py-12 sm:py-20">
        <HealthTips />
      </div>

      {/* Newsletter Signup */}
      <div className="relative z-10 py-12 sm:py-20 bg-gradient-to-r from-teal-50 to-emerald-50">
        <NewsletterSignup />
      </div>
    </div>
  );
};

export default Hub;
