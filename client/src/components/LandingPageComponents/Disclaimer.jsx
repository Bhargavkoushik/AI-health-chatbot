import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Enhanced Warning Icon with Animation
const WarningIcon = () => (
    <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            duration: 0.8 
        }}
        className="relative mb-6"
    >
        <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl"></div>
        <svg 
            className="relative w-16 h-16 sm:w-20 sm:h-20 text-amber-500 mx-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
        </svg>
    </motion.div>
);

// Emergency Contact Card Component
const EmergencyCard = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative group"
    >
        {/* Animated border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
        
        <div className="relative bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-red-800 mb-2">
                        Medical Emergency?
                    </h3>
                    <p className="text-red-700 text-sm sm:text-base leading-relaxed">
                        If you are experiencing a medical emergency, <strong>do not use this platform</strong>. 
                        Call your local emergency services immediately or visit the nearest emergency room.
                    </p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                        <div className="flex items-center gap-2 text-red-600 font-semibold">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-sm sm:text-base">Emergency: 911 (US) | 102 (India)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

const Disclaimer = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, threshold: 0.2 });

    const disclaimerPoints = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Educational Purpose Only",
            description: "Our AI-powered tool provides general health information for educational purposes and should not replace professional medical consultation."
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: "Not Medical Diagnosis",
            description: "This platform cannot diagnose medical conditions. Always consult with qualified healthcare professionals for accurate diagnosis and treatment."
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Seek Professional Care",
            description: "Never delay seeking medical advice or disregard professional medical guidance based on information from this platform."
        }
    ];

    return (
        <section 
            ref={sectionRef}
            className="relative bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30 py-16 sm:py-20 lg:py-24 overflow-hidden"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-4 h-16 bg-amber-600 rounded-full transform rotate-45"></div>
                <div className="absolute top-24 left-16 w-16 h-4 bg-amber-600 rounded-full transform rotate-45"></div>
                <div className="absolute bottom-32 right-24 w-3 h-12 bg-orange-600 rounded-full transform -rotate-45"></div>
                <div className="absolute bottom-28 right-20 w-12 h-3 bg-orange-600 rounded-full transform -rotate-45"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="text-center mb-12 sm:mb-16">
                    <WarningIcon />
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 border border-amber-200 rounded-full mb-6">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-sm font-medium text-amber-700">Important Medical Disclaimer</span>
                        </div>
                        
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight mb-4">
                            Please Read This
                            <br />
                            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                Important Information
                            </span>
                        </h2>
                    </motion.div>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed px-4"
                    >
                        Your health and safety are our top priorities. Please understand the limitations 
                        and proper use of our AI-powered health information platform.
                    </motion.p>
                </div>

                {/* Disclaimer Points Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
                    {disclaimerPoints.map((point, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                            className="group relative"
                        >
                            {/* Hover Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                            
                            <div className="relative bg-white/80 backdrop-blur-sm border border-white/60 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                                            {point.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-800 mb-3">
                                            {point.title}
                                        </h3>
                                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                            {point.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Disclaimer Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg mb-8 sm:mb-12"
                >
                    <div className="max-w-4xl mx-auto text-center">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">
                            Legal Disclaimer & Terms of Use
                        </h3>
                        
                        <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed text-left">
                            <p>
                                <strong>MediCore Health Intelligence Hub</strong> is an AI-powered informational platform designed to provide general health education and symptom analysis. This service is <strong>not a substitute</strong> for professional medical advice, diagnosis, or treatment.
                            </p>
                            
                            <p>
                                The information, recommendations, and guidance provided by our platform are for <strong>educational purposes only</strong> and should not be considered as medical advice. Individual health conditions vary significantly, and only qualified healthcare professionals can provide personalized medical guidance.
                            </p>
                            
                            <p>
                                <strong>Always consult with your physician</strong> or other qualified healthcare provider before making any healthcare decisions or for guidance about a specific medical condition. Never disregard professional medical advice or delay in seeking it because of information you have accessed through our platform.
                            </p>
                            
                            <p>
                                By using this platform, you acknowledge that you understand these limitations and agree to use the information responsibly as part of your broader healthcare decision-making process.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Emergency Contact Card */}
                <EmergencyCard />

                {/* Bottom Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="mt-12 pt-8 border-t border-slate-200 text-center"
                >
                    <p className="text-sm text-slate-500 mb-4">
                        This platform is designed with your safety in mind
                    </p>
                    
                    <div className="flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>HIPAA Compliant</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Privacy Protected</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Medically Reviewed Content</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Disclaimer;
