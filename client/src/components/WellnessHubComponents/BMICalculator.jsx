import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BMICalculator = () => {
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(70);
    const [unit, setUnit] = useState('metric');
    const [heightFeet, setHeightFeet] = useState(5);
    const [heightInches, setHeightInches] = useState(7);
    const [bmi, setBmi] = useState(24.2);
    const [category, setCategory] = useState('Normal weight');
    const [isCalculating, setIsCalculating] = useState(false);

    useEffect(() => {
        setIsCalculating(true);
        const timer = setTimeout(() => {
            if (height > 0 && weight > 0) {
                let heightInMeters = height / 100;
                let weightInKg = weight;
                
                if (unit === 'imperial') {
                    heightInMeters = (heightFeet * 12 + heightInches) * 0.0254;
                    weightInKg = weight * 0.453592;
                }
                
                const calculatedBmi = parseFloat((weightInKg / (heightInMeters * heightInMeters)).toFixed(1));
                setBmi(calculatedBmi);

                if (calculatedBmi < 18.5) setCategory('Underweight');
                else if (calculatedBmi >= 18.5 && calculatedBmi <= 24.9) setCategory('Normal weight');
                else if (calculatedBmi >= 25 && calculatedBmi <= 29.9) setCategory('Overweight');
                else setCategory('Obesity');
            }
            setIsCalculating(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [height, weight, unit, heightFeet, heightInches]);

    const getBmiRotation = () => {
        const clampedBmi = Math.max(10, Math.min(40, bmi));
        return (clampedBmi - 10) / 30 * 180 - 90;
    };
    
    const getBmiColor = () => {
        if (category === 'Underweight') return { text: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-300' };
        if (category === 'Normal weight') return { text: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-300' };
        if (category === 'Overweight') return { text: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-300' };
        return { text: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300' };
    };

    const getHealthTips = () => {
        if (category === 'Underweight') return 'Consider consulting a nutritionist for healthy weight gain strategies.';
        if (category === 'Normal weight') return 'Great! Maintain your healthy lifestyle with balanced diet and regular exercise.';
        if (category === 'Overweight') return 'Consider increasing physical activity and reviewing your dietary habits.';
        return 'Consult with a healthcare professional for personalized weight management plan.';
    };

    const colors = getBmiColor();

    return (
        <div className="relative bg-white/80 backdrop-blur-sm border border-white/60 rounded-3xl p-4 sm:p-6 overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            
            <div className="relative h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4 sm:mb-6 flex-shrink-0">
                    <motion.div 
                        className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                        <span className="text-lg sm:text-xl text-white">⚖️</span>
                    </motion.div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">BMI Calculator</h3>
                        <p className="text-xs sm:text-sm text-slate-600">Body Mass Index Assessment</p>
                    </div>
                </div>

                {/* Unit Toggle */}
                <div className="flex justify-center mb-4 flex-shrink-0">
                    <div className="bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setUnit('metric')}
                            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                                unit === 'metric' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'
                            }`}
                        >
                            Metric
                        </button>
                        <button
                            onClick={() => setUnit('imperial')}
                            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                                unit === 'imperial' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'
                            }`}
                        >
                            Imperial
                        </button>
                    </div>
                </div>

                {/* BMI Gauge */}
                <div className="flex-1 flex items-center justify-center my-4">
                    <div className="relative w-32 sm:w-40 h-16 sm:h-20">
                        <div className="absolute bottom-0 left-0 w-full h-full border-3 border-slate-200 rounded-t-full border-b-0"></div>
                        <div className="absolute bottom-0 left-0 w-full h-full rounded-t-full overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-1/4 h-full bg-amber-200"></div>
                            <div className="absolute bottom-0 left-1/4 w-1/4 h-full bg-emerald-200"></div>
                            <div className="absolute bottom-0 left-2/4 w-1/4 h-full bg-orange-200"></div>
                            <div className="absolute bottom-0 left-3/4 w-1/4 h-full bg-red-200"></div>
                        </div>
                        <motion.div 
                            className="absolute bottom-0 left-1/2 w-0.5 sm:w-1 h-3 sm:h-4 bg-slate-700 rounded-full transition-transform duration-500" 
                            style={{ 
                                transform: `translateX(-50%) rotate(${getBmiRotation()}deg) translateY(-4rem)`,
                                transformOrigin: 'bottom center'
                            }}
                            animate={{ rotate: getBmiRotation() }}
                        />
                        <div className="absolute bottom-1 left-1/2 w-3 sm:w-4 h-3 sm:h-4 bg-slate-700 rounded-full transform -translate-x-1/2"></div>
                    </div>
                </div>

                {/* BMI Result */}
                <div className="text-center mb-4 sm:mb-6 flex-shrink-0">
                    <motion.p 
                        className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2"
                        animate={{ scale: isCalculating ? [1, 1.05, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isCalculating ? '...' : bmi}
                    </motion.p>
                    <div className={`inline-block px-3 sm:px-4 py-1 sm:py-2 rounded-full border ${colors.bg} ${colors.border} ${colors.text} text-sm sm:text-base font-semibold`}>
                        {category}
                    </div>
                </div>

                {/* Input Controls */}
                <div className="space-y-3 sm:space-y-4 flex-shrink-0">
                    {unit === 'metric' ? (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="text-xs sm:text-sm font-medium text-slate-600 mb-2 block">
                                    Height: {height} cm
                                </label>
                                <input 
                                    type="range" 
                                    min="120" 
                                    max="220" 
                                    value={height} 
                                    onChange={e => setHeight(e.target.value)} 
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                                />
                            </div>
                            <div>
                                <label className="text-xs sm:text-sm font-medium text-slate-600 mb-2 block">
                                    Weight: {weight} kg
                                </label>
                                <input 
                                    type="range" 
                                    min="40" 
                                    max="150" 
                                    value={weight} 
                                    onChange={e => setWeight(e.target.value)} 
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="text-xs sm:text-sm font-medium text-slate-600 mb-2 block">
                                    Height: {heightFeet}'{heightInches}"
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="range" 
                                        min="4" 
                                        max="7" 
                                        value={heightFeet} 
                                        onChange={e => setHeightFeet(parseInt(e.target.value))} 
                                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="11" 
                                        value={heightInches} 
                                        onChange={e => setHeightInches(parseInt(e.target.value))} 
                                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs sm:text-sm font-medium text-slate-600 mb-2 block">
                                    Weight: {weight} lbs
                                </label>
                                <input 
                                    type="range" 
                                    min="88" 
                                    max="330" 
                                    value={weight} 
                                    onChange={e => setWeight(e.target.value)} 
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Health Tip */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl flex-shrink-0">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        💡 {getHealthTips()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BMICalculator;
