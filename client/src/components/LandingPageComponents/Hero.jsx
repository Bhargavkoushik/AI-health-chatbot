import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
    const canvasRef = useRef(null);
    const sectionRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const { scrollY } = useScroll();
    
    // Parallax effects
    const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
    const contentY = useTransform(scrollY, [0, 500], [0, -100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Enhanced canvas animation with performance optimizations
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let canvasWidth = window.innerWidth;
        let canvasHeight = Math.min(window.innerHeight, 800);

        // Performance optimization: reduce particles on mobile
        const getParticleCount = () => {
            if (isMobile) return Math.floor((canvasWidth * canvasHeight) / 15000);
            return Math.floor((canvasWidth * canvasHeight) / 8000);
        };

        // Set canvas dimensions with device pixel ratio for crisp rendering
        const setCanvasDimensions = () => {
            const dpr = window.devicePixelRatio || 1;
            canvasWidth = window.innerWidth;
            canvasHeight = Math.min(window.innerHeight, 800);
            
            canvas.width = canvasWidth * dpr;
            canvas.height = canvasHeight * dpr;
            canvas.style.width = canvasWidth + 'px';
            canvas.style.height = canvasHeight + 'px';
            
            ctx.scale(dpr, dpr);
        };

        // Enhanced Particle class with medical-themed colors
        class Particle {
            constructor() {
                this.x = Math.random() * canvasWidth;
                this.y = Math.random() * canvasHeight;
                this.size = Math.random() * (isMobile ? 1 : 2) + 0.5;
                this.speedX = (Math.random() * 1.5 - 0.75) * (isMobile ? 0.5 : 1);
                this.speedY = (Math.random() * 1.5 - 0.75) * (isMobile ? 0.5 : 1);
                // Medical color palette: teal, cyan, emerald variations
                const colors = [
                    'rgba(20, 184, 166, 0.8)',  // teal-500
                    'rgba(6, 182, 212, 0.8)',   // cyan-500
                    'rgba(16, 185, 129, 0.8)',  // emerald-500
                    'rgba(59, 130, 246, 0.6)',  // blue-500
                    'rgba(255, 255, 255, 0.7)'  // white
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.pulse = Math.random() * Math.PI * 2;
            }

            update() {
                if (this.x > canvasWidth || this.x < 0) this.speedX *= -1;
                if (this.y > canvasHeight || this.y < 0) this.speedY *= -1;
                this.x += this.speedX;
                this.y += this.speedY;
                this.pulse += 0.02;
            }

            draw() {
                const pulseSize = this.size + Math.sin(this.pulse) * 0.3;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize particles
        const init = () => {
            particles = [];
            const numberOfParticles = getParticleCount();
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        };

        // Enhanced connection algorithm with medical-themed styling
        const connect = () => {
            const maxDistance = isMobile ? 80 : 120;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.4;
                        ctx.strokeStyle = `rgba(20, 184, 166, ${opacity})`;
                        ctx.lineWidth = isMobile ? 0.5 : 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        // Optimized animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            if (!isMobile || particles.length < 30) {
                connect();
            }
            
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            setCanvasDimensions();
            init();
        };

        setCanvasDimensions();
        init();
        animate();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isMobile]);

    return (
        <section 
            ref={sectionRef}
            className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 text-slate-800 min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Animated Canvas Background */}
            <motion.canvas 
                ref={canvasRef} 
                style={{ y: backgroundY }}
                className="absolute top-0 left-0 w-full h-full z-0 opacity-30"
            />
            
            {/* Medical Cross Pattern Overlay */}
            <div className="absolute inset-0 z-5">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 right-20 w-6 h-6 opacity-5"
                >
                    <div className="absolute top-0 left-1/2 w-0.5 h-6 bg-teal-600 -translate-x-1/2"></div>
                    <div className="absolute top-1/2 left-0 w-6 h-0.5 bg-teal-600 -translate-y-1/2"></div>
                </motion.div>
                
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-32 left-16 w-4 h-4 opacity-5"
                >
                    <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-emerald-600 -translate-x-1/2"></div>
                    <div className="absolute top-1/2 left-0 w-4 h-0.5 bg-emerald-600 -translate-y-1/2"></div>
                </motion.div>
            </div>

            {/* Gradient Overlay for Better Text Readability */}
            <motion.div 
                style={{ opacity }}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/20 to-white/40 z-10"
            />

            {/* Main Content */}
            <motion.div 
                style={{ y: contentY, opacity }}
                className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
            >
                {/* Status Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-full mb-8 shadow-lg"
                >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-teal-700">AI-Powered Health Assistant</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight"
                >
                    Your Intelligent{' '}
                    <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                        Health
                    </span>
                    <br />
                    <span className="text-slate-700 font-light">Care Companion</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl text-slate-600 mb-10 leading-relaxed font-light"
                >
                    Experience advanced AI-powered health guidance. Check symptoms, understand conditions, 
                    get personalized health insights, and connect with qualified healthcare specialists.
                </motion.p>

                {/* Feature Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10"
                >
                    {[
                        { icon: '🩺', text: 'Symptom Analysis' },
                        { icon: '🧠', text: 'AI Diagnosis' },
                        { icon: '👩‍⚕️', text: 'Expert Network' },
                        { icon: '📊', text: 'Health Insights' }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/80 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <span className="text-lg">{feature.icon}</span>
                            <span className="text-sm font-medium text-slate-700">{feature.text}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call to Action Buttons */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
                >
                    <motion.a
                        href="/symptom-checker"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Start Health Check
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </motion.a>
                    
                    <motion.a
                        href="/tech-stack"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm hover:bg-white text-teal-700 font-semibold py-4 px-8 rounded-xl text-lg border-2 border-teal-200 hover:border-teal-300 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Learn More
                    </motion.a>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500"
                >
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>HIPAA Compliant</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Privacy Protected</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Medically Reviewed</span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Floating Health Icons */}
            <div className="absolute inset-0 z-5 pointer-events-none">
                {[
                    { icon: '🫀', top: '20%', left: '10%', delay: 0 },
                    { icon: '🧬', top: '30%', right: '15%', delay: 2 },
                    { icon: '💊', bottom: '25%', left: '8%', delay: 4 },
                    { icon: '🩺', bottom: '20%', right: '12%', delay: 1 },
                    { icon: '⚕️', top: '60%', left: '5%', delay: 3 }
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            delay: item.delay,
                            ease: "easeInOut"
                        }}
                        className="absolute text-3xl sm:text-4xl opacity-20"
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

export default Hero;
