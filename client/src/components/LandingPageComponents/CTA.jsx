import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const CTA = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, threshold: 0.3 });
    const [isMobile, setIsMobile] = useState(false);
    const { scrollY } = useScroll();
    
    // Parallax effect for background elements
    const backgroundY = useTransform(scrollY, [0, 1000], [0, -100]);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section 
            ref={sectionRef}
            className="relative bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-600 overflow-hidden"
        >
            {/* Medical Cross Pattern Background */}
            <motion.div 
                style={{ y: backgroundY }}
                className="absolute inset-0 opacity-10"
            >
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 40v-8h-4v8h-8v4h8v8h4v-8h8v-4h-8zm0-40V0h-4v8h-8v4h8v8h4V12h8V8h-8zM8 40v-8H4v8H0v4h4v8h4v-8h8v-4H8zM8 8V0H4v8H0v4h4v8h4V12h8V8H8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '80px 80px'
                }}></div>
            </motion.div>

            {/* Floating Medical Icons */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[
                    { icon: '🩺', top: '15%', left: '10%', delay: 0, size: 'text-4xl sm:text-5xl' },
                    { icon: '💊', top: '20%', right: '15%', delay: 2, size: 'text-3xl sm:text-4xl' },
                    { icon: '🫀', bottom: '25%', left: '12%', delay: 4, size: 'text-5xl sm:text-6xl' },
                    { icon: '🧬', bottom: '30%', right: '8%', delay: 1, size: 'text-4xl sm:text-5xl' },
                    { icon: '⚕️', top: '50%', left: '5%', delay: 3, size: 'text-3xl sm:text-4xl' },
                    { icon: '🔬', top: '60%', right: '5%', delay: 5, size: 'text-4xl sm:text-5xl' }
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 10, 0],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: 8 + index,
                            repeat: Infinity,
                            delay: item.delay,
                            ease: "easeInOut"
                        }}
                        className={`absolute ${item.size} opacity-20`}
                        style={{
                            top: item.top,
                            bottom: item.bottom,
                            left: item.left,
                            right: item.right
                        }}
                    >
                        {item.icon}
                    </motion.div>
                ))}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/90 via-emerald-600/90 to-cyan-600/90"></div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center">
                
                {/* Status Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full mb-8"
                >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-white">Start Your Health Journey</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight mb-6 leading-tight"
                >
                    Ready to Take Control of
                    <br />
                    <span className="text-cyan-200">Your Health?</span>
                </motion.h2>

                {/* Subtext */}
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-base sm:text-lg lg:text-xl text-emerald-100 max-w-3xl mx-auto mb-10 leading-relaxed px-4"
                >
                    Get instant, confidential health insights powered by advanced AI. 
                    Our intelligent symptom checker is free, secure, and requires no sign-up. 
                    Start your personalized health assessment in seconds.
                </motion.p>

                {/* Features List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-10"
                >
                    {[
                        { icon: '🚀', text: 'Instant Results' },
                        { icon: '🔒', text: '100% Private' },
                        { icon: '🆓', text: 'No Sign-Up' },
                        { icon: '🩺', text: 'AI-Powered' }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full"
                        >
                            <span className="text-lg">{feature.icon}</span>
                            <span className="text-sm font-medium text-white">{feature.text}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call to Action Buttons */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-10"
                >
                    <motion.a
                        href="/symptom-checker"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-teal-600 hover:text-teal-700 font-bold py-4 px-8 sm:px-10 rounded-full text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl hover:bg-gray-50"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Check My Symptoms Now
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </motion.a>

                    <motion.a
                        href="/learn-more"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-teal-600 font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Learn How It Works
                    </motion.a>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-emerald-100"
                >
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>HIPAA Compliant & Secure</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Your Data Stays Private</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Medically Reviewed Content</span>
                    </div>
                </motion.div>

                {/* Bottom Tagline */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 1.4 }}
                    className="mt-8 pt-8 border-t border-white/20"
                >
                    <p className="text-cyan-200 font-medium">
                        Your health journey, powered by intelligent technology
                    </p>
                    
                    {/* User Count */}
                    <div className="mt-4 flex items-center justify-center gap-3">
                        <div className="flex -space-x-2">
                            {[1,2,3,4,5].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 border-2 border-white flex items-center justify-center text-white text-xs">
                                    👤
                                </div>
                            ))}
                        </div>
                        <span className="text-sm text-emerald-100">
                            Join 50,000+ users who trust our health insights
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
