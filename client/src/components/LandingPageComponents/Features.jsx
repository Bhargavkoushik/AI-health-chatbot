import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// Enhanced Feature Card Component
const FeatureCard = ({ icon, title, children, index, color, delay }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);

    // Enhanced mouse tracking for gradient effect
    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setMousePosition({ x, y });
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.6, 
                delay: delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative h-full"
        >
            {/* Background Card */}
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/60 p-6 sm:p-8 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:bg-white hover:shadow-2xl hover:scale-[1.02] h-full flex flex-col">
                
                {/* Mouse Following Gradient Effect */}
                <div 
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                    style={{
                        background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, ${color}15, transparent 60%)`,
                    }}
                />

                {/* Glow Border Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${color.replace('rgba', '').replace(/[()]/g, '').split(',').slice(0,3).join(',').replace(/\d+/g, (match, offset) => offset === 0 ? match : '60')} rounded-2xl sm:rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500`} />
                
                {/* Content Container */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Icon Container */}
                    <div className={`inline-flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-r ${color.includes('teal') ? 'from-teal-500 to-emerald-500' : color.includes('blue') ? 'from-blue-500 to-indigo-500' : color.includes('emerald') ? 'from-emerald-500 to-green-500' : 'from-cyan-500 to-teal-500'} rounded-xl sm:rounded-2xl text-white mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        {icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 leading-tight group-hover:text-teal-700 transition-colors duration-300 flex-shrink-0">
                        {title}
                    </h3>

                    {/* Description - Flex grow to fill space */}
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed flex-grow">
                        {children}
                    </p>

                    {/* Feature Indicator */}
                    <div className="mt-4 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm text-teal-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Learn more
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Main Features Section Component
const Features = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, threshold: 0.2 });
    const [isMobile, setIsMobile] = useState(false);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const featureData = [
        {
            icon: (
                <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12h.01M12 12h.01M9 12h.01" />
                </svg>
            ),
            title: "Smart Symptom Analysis",
            description: "Describe symptoms in natural language. Our AI understands context and provides immediate, personalized health insights with medical accuracy.",
            color: "rgba(20, 184, 166, 0.2)" // teal
        },
        {
            icon: (
                <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            title: "Specialist Recommendations",
            description: "Intelligent matching system connects you with the right medical specialists based on your specific symptoms and health profile.",
            color: "rgba(59, 130, 246, 0.2)" // blue
        },
        {
            icon: (
                <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: "Privacy & Security First",
            description: "HIPAA-compliant platform with end-to-end encryption. Your health data remains private, secure, and under your complete control.",
            color: "rgba(16, 185, 129, 0.2)" // emerald
        },
        {
            icon: (
                <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: "Advanced AI Engine",
            description: "Powered by state-of-the-art RAG architecture and medical-grade language models for fast, accurate, and contextually relevant responses.",
            color: "rgba(6, 182, 212, 0.2)" // cyan
        }
    ];

    return (
        <section 
            ref={sectionRef}
            className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 py-16 sm:py-20 lg:py-24 overflow-hidden"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-4 h-16 bg-teal-600 rounded-full"></div>
                <div className="absolute top-24 left-16 w-16 h-4 bg-teal-600 rounded-full"></div>
                <div className="absolute bottom-32 right-24 w-3 h-12 bg-emerald-600 rounded-full"></div>
                <div className="absolute bottom-28 right-20 w-12 h-3 bg-emerald-600 rounded-full"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 sm:mb-16 lg:mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-full mb-6">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <span className="text-sm font-medium text-teal-700">Why Choose Our Platform</span>
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight mb-6">
                        Your Trusted Health
                        <br />
                        <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                            Intelligence Partner
                        </span>
                    </h2>
                    
                    <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
                        Experience healthcare technology designed with precision, powered by AI, 
                        and built with your privacy and well-being as our top priorities.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
                    style={{ gridAutoRows: '1fr' }} // Ensures equal height cards
                >
                    {featureData.map((feature, index) => (
                        <FeatureCard 
                            key={index} 
                            icon={feature.icon} 
                            title={feature.title}
                            color={feature.color}
                            delay={index * 0.15}
                            index={index}
                        >
                            {feature.description}
                        </FeatureCard>
                    ))}
                </div>

                {/* Bottom CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-center mt-16 sm:mt-20"
                >
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[1,2,3,4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                                        {i === 1 ? '👩‍⚕️' : i === 2 ? '👨‍⚕️' : i === 3 ? '🧑‍⚕️' : '👩‍🔬'}
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm text-slate-600 font-medium ml-2">
                                Trusted by 10,000+ healthcare professionals
                            </span>
                        </div>
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Get Started Today
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Floating Medical Icons */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[
                    { icon: '🩺', top: '15%', left: '5%', delay: 0 },
                    { icon: '💊', top: '25%', right: '8%', delay: 2 },
                    { icon: '🧬', bottom: '30%', left: '3%', delay: 4 },
                    { icon: '⚕️', bottom: '20%', right: '5%', delay: 1 }
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        animate={{
                            y: [0, -15, 0],
                            opacity: [0.1, 0.3, 0.1],
                            rotate: [0, 5, 0]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            delay: item.delay,
                            ease: "easeInOut"
                        }}
                        className="absolute text-2xl sm:text-3xl opacity-10"
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
        </section>
    );
};

export default Features;
