import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const featuredContent = [
  {
    id: 1,
    title: 'AI-Enhanced Health Education',
    description: 'Interactive health learning experiences with personalized medical education content, symptom checkers, and evidence-based health guidance.',
    image: '🧠',
    category: 'Health Education',
    metrics: 'Interactive Learning',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 2,
    title: 'Comprehensive Medicine Guide',
    description: 'Detailed medication information, drug interactions, dosage guidelines, and safe medication management practices.',
    image: '💊',
    category: 'Medication Safety',
    metrics: 'Safe Usage',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 3,
    title: 'Global Health Insights',
    description: 'Worldwide health trends, disease prevention strategies, and public health information from trusted medical sources.',
    image: '🌍',
    category: 'Public Health',
    metrics: 'Global Coverage',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 4,
    title: 'Environmental Wellness',
    description: 'Environmental health factors, air quality awareness, water safety, and creating healthier living environments.',
    image: '🌿',
    category: 'Environmental Health',
    metrics: 'Clean Living',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 5,
    title: 'Medical Research Updates',
    description: 'Latest medical breakthroughs, research findings, clinical studies, and evidence-based health recommendations.',
    image: '🔬',
    category: 'Medical Research',
    metrics: 'Latest Studies',
    color: 'from-orange-500 to-red-600'
  }
];

const FeaturedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying || !isInView) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredContent.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isInView]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredContent.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredContent.length) % featuredContent.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-100 rounded-full mb-4 sm:mb-6">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium text-indigo-700">Featured Health Resources</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-slate-800">
          Advanced Health
          <br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Knowledge Platform
          </span>
        </h2>
        
        <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto px-4">
          Discover comprehensive health resources powered by medical expertise and evidence-based information
        </p>
      </motion.div>

      {/* Main Carousel */}
      <div className="relative">
        {/* Carousel Container - Mobile optimized height */}
        <div className="relative h-[500px] sm:h-[400px] md:h-96 lg:h-[32rem] overflow-hidden rounded-2xl sm:rounded-3xl bg-white/50 backdrop-blur-sm border border-white/60 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: isMobile ? 200 : 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isMobile ? -200 : -300 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              {/* Mobile Layout (Stacked) */}
              <div className="md:hidden flex flex-col items-center justify-center w-full h-full p-6 text-center">
                {/* Visual Section - Top on mobile */}
                <div className="flex items-center justify-center mb-6">
                  <div className={`relative w-32 h-32 bg-gradient-to-br ${featuredContent[currentIndex].color} rounded-2xl flex items-center justify-center shadow-xl`}>
                    <div className="text-4xl">
                      {featuredContent[currentIndex].image}
                    </div>
                    
                    {/* Floating Elements */}
                    <motion.div
                      animate={{ 
                        y: [0, -8, 0],
                        rotate: [0, 5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30"
                    ></motion.div>
                  </div>
                </div>

                {/* Content Section - Bottom on mobile */}
                <div className="flex-1 w-full max-w-sm">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full mb-3">
                    <span className="text-xs font-medium text-slate-600">
                      {featuredContent[currentIndex].category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight">
                    {featuredContent[currentIndex].title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {featuredContent[currentIndex].description}
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${featuredContent[currentIndex].color} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                        ✓
                      </div>
                      <span className="text-sm text-slate-600 font-medium">
                        {featuredContent[currentIndex].metrics}
                      </span>
                    </div>
                    
                    <button className={`w-full px-6 py-3 bg-gradient-to-r ${featuredContent[currentIndex].color} text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                      Learn More
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop/Tablet Layout (Side by side) */}
              <div className="hidden md:flex items-center justify-between w-full h-full p-8 lg:p-16">
                {/* Content Side */}
                <div className="flex-1 lg:pr-12 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full mb-4">
                    <span className="text-sm font-medium text-slate-600">
                      {featuredContent[currentIndex].category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-4 leading-tight">
                    {featuredContent[currentIndex].title}
                  </h3>
                  
                  <p className="text-base lg:text-lg text-slate-600 mb-6 leading-relaxed max-w-lg">
                    {featuredContent[currentIndex].description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${featuredContent[currentIndex].color} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                        ✓
                      </div>
                      <span className="text-sm text-slate-600 font-medium">
                        {featuredContent[currentIndex].metrics}
                      </span>
                    </div>
                    
                    <button className={`px-6 py-3 bg-gradient-to-r ${featuredContent[currentIndex].color} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                      Learn More
                    </button>
                  </div>
                </div>

                {/* Visual Side */}
                <div className="flex-1 flex items-center justify-center lg:justify-end">
                  <div className={`relative w-64 lg:w-80 h-64 lg:h-80 bg-gradient-to-br ${featuredContent[currentIndex].color} rounded-3xl flex items-center justify-center shadow-2xl`}>
                    <div className="text-7xl lg:text-9xl">
                      {featuredContent[currentIndex].image}
                    </div>
                    
                    {/* Floating Elements */}
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30"
                    ></motion.div>
                    
                    <motion.div
                      animate={{ 
                        y: [0, 15, 0],
                        rotate: [0, -5, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                      className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30"
                    ></motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 z-10"
          >
            <svg className="w-5 sm:w-6 h-5 sm:h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 z-10"
          >
            <svg className="w-5 sm:w-6 h-5 sm:h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center mt-6 sm:mt-8 gap-2 sm:gap-3">
          {featuredContent.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 sm:w-12 h-2 sm:h-3 bg-gradient-to-r from-indigo-500 to-purple-600' 
                  : 'w-2 sm:w-3 h-2 sm:h-3 bg-slate-300 hover:bg-slate-400'
              }`}
            >
              {index === currentIndex && isAutoPlaying && (
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className="h-full bg-white/30 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
