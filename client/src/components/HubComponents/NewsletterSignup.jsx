import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.5 });

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    setEmail('');
    
    // Reset after 5 seconds for demo
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        {/* Background with Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl sm:rounded-3xl"></div>
        
        {/* Dot Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-4 sm:top-8 right-6 sm:right-12 w-12 sm:w-16 h-12 sm:h-16 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20"
          ></motion.div>
          
          <motion.div
            animate={{ 
              y: [0, 25, 0],
              rotate: [0, -15, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-6 sm:bottom-12 left-8 sm:left-16 w-8 sm:w-12 h-8 sm:h-12 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/20"
          ></motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            className="absolute top-1/2 left-4 sm:left-8 w-6 sm:w-8 h-6 sm:h-8 bg-white/10 backdrop-blur-sm rounded-md sm:rounded-lg border border-white/20"
          ></motion.div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-8 sm:p-12 lg:p-16 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 sm:mb-8">
              <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Health Knowledge Updates</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Stay Informed About Your Health
            </h2>
            
            <p className="text-base sm:text-xl text-emerald-100 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Join 25,000+ health-conscious individuals receiving weekly insights on wellness, 
              medical breakthroughs, nutrition tips, and evidence-based health advice.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/90 backdrop-blur-sm border border-white/50 rounded-lg sm:rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all duration-300 text-sm sm:text-base"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-teal-600 rounded-lg sm:rounded-xl font-semibold hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                        {isMobile ? 'Joining...' : 'Subscribing...'}
                      </div>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="max-w-lg mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="w-12 sm:w-16 h-12 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                >
                  <svg className="w-6 sm:w-8 h-6 sm:h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Welcome to Our Health Community!</h3>
                <p className="text-sm sm:text-base text-emerald-100">
                  You'll receive your first health newsletter within 24 hours.
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-emerald-100"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Privacy Protected
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              No Spam Ever
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 110 19.5 9.75 9.75 0 010-19.5z" />
              </svg>
              Unsubscribe Anytime
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NewsletterSignup;
