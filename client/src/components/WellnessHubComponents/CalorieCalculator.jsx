import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CalorieCalculator = () => {
    const [age, setAge] = useState(30);
    const [gender, setGender] = useState('male');
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(170);
    const [activity, setActivity] = useState(1.55);
    const [goal, setGoal] = useState('maintain');
    const [calories, setCalories] = useState(0);
    const [goalCalories, setGoalCalories] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);

    useEffect(() => {
        setIsCalculating(true);
        const timer = setTimeout(() => {
            let bmr;
            if (gender === 'male') {
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            } else {
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            }
            const maintenance = bmr * activity;
            setCalories(maintenance.toFixed(0));
            
            let goalCals = maintenance;
            if (goal === 'lose') goalCals -= 500;
            else if (goal === 'gain') goalCals += 500;
            setGoalCalories(goalCals.toFixed(0));
            setIsCalculating(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [age, gender, weight, height, activity, goal]);

    const getActivityLevel = () => {
        if (activity <= 1.2) return { name: 'Sedentary', emoji: '🪑', color: 'text-slate-600' };
        if (activity <= 1.375) return { name: 'Light', emoji: '🚶‍♀️', color: 'text-blue-600' };
        if (activity <= 1.55) return { name: 'Moderate', emoji: '🏃‍♀️', color: 'text-green-600' };
        if (activity <= 1.725) return { name: 'Active', emoji: '🏋️‍♀️', color: 'text-orange-600' };
        return { name: 'Very Active', emoji: '🤸‍♀️', color: 'text-red-600' };
    };

    const getGoalInfo = () => {
        if (goal === 'lose') return { name: 'Weight Loss', emoji: '📉', color: 'text-red-600', bg: 'bg-red-50' };
        if (goal === 'gain') return { name: 'Weight Gain', emoji: '📈', color: 'text-green-600', bg: 'bg-green-50' };
        return { name: 'Maintenance', emoji: '⚖️', color: 'text-blue-600', bg: 'bg-blue-50' };
    };

    const activityInfo = getActivityLevel();
    const goalInfo = getGoalInfo();

    return (
        <div className="relative bg-white/80 backdrop-blur-sm border border-white/60 rounded-3xl p-4 sm:p-6 overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            
            <div className="relative h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4 sm:mb-6 flex-shrink-0">
                    <motion.div 
                        className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                        <span className="text-lg sm:text-xl text-white">🔥</span>
                    </motion.div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">Calorie Calculator</h3>
                        <p className="text-xs sm:text-sm text-slate-600">Daily Energy Requirements</p>
                    </div>
                </div>

                {/* Results Display */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 flex-shrink-0">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs sm:text-sm text-slate-600">Maintenance Calories</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${activityInfo.color} bg-white/80`}>
                                {activityInfo.emoji} {activityInfo.name}
                            </span>
                        </div>
                        <motion.p 
                            className="text-2xl sm:text-3xl font-extrabold text-slate-800"
                            animate={{ scale: isCalculating ? [1, 1.05, 1] : 1 }}
                        >
                            {isCalculating ? '...' : calories}
                        </motion.p>
                        <p className="text-xs sm:text-sm text-slate-500">kcal / day</p>
                    </div>
                    
                    <div className={`${goalInfo.bg} rounded-2xl p-3 sm:p-4 border border-opacity-20`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs sm:text-sm text-slate-600">Goal Calories</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${goalInfo.color} bg-white/80`}>
                                {goalInfo.emoji} {goalInfo.name}
                            </span>
                        </div>
                        <motion.p 
                            className={`text-2xl sm:text-3xl font-bold ${goalInfo.color}`}
                            animate={{ scale: isCalculating ? [1, 1.05, 1] : 1 }}
                        >
                            {isCalculating ? '...' : goalCalories}
                        </motion.p>
                        <p className="text-xs text-slate-500">
                            {goal === 'lose' ? '-500 cal/day' : goal === 'gain' ? '+500 cal/day' : 'Maintenance'}
                        </p>
                    </div>
                </div>

                {/* Input Controls */}
                <div className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="text-xs sm:text-sm font-medium text-slate-600 mb-2 block">Age</label>
                            <input 
                                type="number" 
                                value={age} 
                                onChange={e => setAge(Math.max(10, Math.min(100, e.target.value)))} 
                                className="w-full bg-slate-50 text-slate-800 p-2 sm:p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs sm:text-sm font-medium text-slate-600 mb-2 block">Gender</label>
                            <select 
                                value={gender} 
                                onChange={e => setGender(e.target.value)} 
                                className="w-full bg-slate-50 text-slate-800 p-2 sm:p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                <option value="male">♂️ Male</option>
                                <option value="female">♀️ Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs sm:text-sm font-medium text-slate-600 mb-2 block">Height (cm)</label>
                            <input 
                                type="number" 
                                value={height} 
                                onChange={e => setHeight(Math.max(100, Math.min(250, e.target.value)))} 
                                className="w-full bg-slate-50 text-slate-800 p-2 sm:p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs sm:text-sm font-medium text-slate-600 mb-2 block">Weight (kg)</label>
                            <input 
                                type="number" 
                                value={weight} 
                                onChange={e => setWeight(Math.max(30, Math.min(200, e.target.value)))} 
                                className="w-full bg-slate-50 text-slate-800 p-2 sm:p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-slate-600 mb-2 block">Activity Level</label>
                        <select 
                            value={activity} 
                            onChange={e => setActivity(parseFloat(e.target.value))} 
                            className="w-full bg-slate-50 text-slate-800 p-2 sm:p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value={1.2}>🪑 Sedentary (desk job)</option>
                            <option value={1.375}>🚶‍♀️ Lightly active (light exercise)</option>
                            <option value={1.55}>🏃‍♀️ Moderately active (moderate exercise)</option>
                            <option value={1.725}>🏋️‍♀️ Very active (hard exercise)</option>
                            <option value={1.9}>🤸‍♀️ Extra active (very hard exercise)</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="text-xs sm:text-sm font-medium text-slate-600 mb-2 block">Goal</label>
                        <select 
                            value={goal} 
                            onChange={e => setGoal(e.target.value)} 
                            className="w-full bg-slate-50 text-slate-800 p-2 sm:p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="lose">📉 Lose Weight (-1 lb/week)</option>
                            <option value="maintain">⚖️ Maintain Weight</option>
                            <option value="gain">📈 Gain Weight (+1 lb/week)</option>
                        </select>
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl flex-shrink-0">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        💡 {goal === 'lose' ? 'Create a 500-calorie deficit daily for healthy weight loss.' : 
                           goal === 'gain' ? 'Add 500 calories daily with protein-rich foods for healthy weight gain.' :
                           'Maintain your current calorie intake for weight stability.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CalorieCalculator;
