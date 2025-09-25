import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

// Updated healthcare features focused on knowledge and health information
const healthcareFeatures = [
  // Medical Knowledge (10 features)
  { 
    id: 1, 
    category: 'Medical Knowledge', 
    name: 'Disease Information Hub', 
    description: 'Comprehensive medical encyclopedia with symptoms, causes, treatments, and prevention strategies for common and rare conditions.', 
    icon: '🩺', 
    route: '/hub/disease-information',
    priority: 'high'
  },
  { 
    id: 2, 
    category: 'Medical Knowledge', 
    name: 'COVID-19 Resource Center', 
    description: 'Latest COVID information, vaccination guidelines, safety protocols, and health recommendations from trusted sources.', 
    icon: '🦠', 
    route: '/hub/covid-resources',
    priority: 'high'
  },
  { 
    id: 3, 
    category: 'Medical Knowledge', 
    name: 'Medical Dictionary', 
    description: 'Easy-to-understand medical terms, procedures, and health concepts explained in simple language for everyone.', 
    icon: '📚', 
    route: '/hub/medical-dictionary',
    priority: 'medium'
  },
  { 
    id: 4, 
    category: 'Medical Knowledge', 
    name: 'Rare Disease Guide', 
    description: 'Information about rare medical conditions, genetic disorders, symptoms recognition, and available support resources.', 
    icon: '🧬', 
    route: '/hub/rare-diseases',
    priority: 'medium'
  },
  { 
    id: 5, 
    category: 'Medical Knowledge', 
    name: 'Cancer Information Center', 
    description: 'Comprehensive cancer education covering types, stages, treatment options, prevention, and survivor support.', 
    icon: '🎗️', 
    route: '/hub/cancer-information',
    priority: 'high'
  },
  { 
    id: 6, 
    category: 'Medical Knowledge', 
    name: 'Infectious Disease Guide', 
    description: 'Prevention tips, symptoms, and treatment information for common infectious diseases and global health threats.', 
    icon: '⚠️', 
    route: '/hub/infectious-diseases',
    priority: 'high'
  },
  { 
    id: 7, 
    category: 'Medical Knowledge', 
    name: 'Genetics & Heredity', 
    description: 'Understanding genetic health, hereditary conditions, family medical history, and genetic counseling resources.', 
    icon: '🧪', 
    route: '/hub/genetics-heredity',
    priority: 'medium'
  },
  { 
    id: 8, 
    category: 'Medical Knowledge', 
    name: 'Mental Health Resources', 
    description: 'Mental wellness information, coping strategies, therapy options, and support resources for psychological well-being.', 
    icon: '🧠', 
    route: '/hub/mental-health',
    priority: 'high'
  },
  { 
    id: 9, 
    category: 'Medical Knowledge', 
    name: 'Child Health Guide', 
    description: 'Pediatric health information, developmental milestones, vaccination schedules, and parenting health tips.', 
    icon: '👶', 
    route: '/hub/child-health',
    priority: 'medium'
  },
  { 
    id: 10, 
    category: 'Medical Knowledge', 
    name: 'Senior Health Care', 
    description: 'Health guidance for aging, chronic condition management, preventive care, and maintaining quality of life.', 
    icon: '👴', 
    route: '/hub/senior-health',
    priority: 'high'
  },

  // Medications & Treatment (10 features)
  { 
    id: 11, 
    category: 'Medications & Treatment', 
    name: 'Medication Guide', 
    description: 'Safe medication use, side effects, drug interactions, and proper storage information for common prescriptions.', 
    icon: '💊', 
    route: '/hub/medication-guide',
    priority: 'high'
  },
  { 
    id: 12, 
    category: 'Medications & Treatment', 
    name: 'Treatment Options Explorer', 
    description: 'Alternative treatment approaches, therapy types, and medical procedures explained with pros and cons.', 
    icon: '⚕️', 
    route: '/hub/treatment-options',
    priority: 'high'
  },
  { 
    id: 13, 
    category: 'Medications & Treatment', 
    name: 'Home Remedies Guide', 
    description: 'Safe and effective natural remedies, home treatments, and when to seek professional medical care.', 
    icon: '🏠', 
    route: '/hub/home-remedies',
    priority: 'medium'
  },
  { 
    id: 14, 
    category: 'Medications & Treatment', 
    name: 'Emergency First Aid', 
    description: 'Essential first aid techniques, emergency response procedures, and life-saving skills everyone should know.', 
    icon: '🚑', 
    route: '/hub/first-aid',
    priority: 'high'
  },
  { 
    id: 15, 
    category: 'Medications & Treatment', 
    name: 'Surgery Information', 
    description: 'Pre and post-surgery care, types of surgical procedures, recovery tips, and what to expect during treatment.', 
    icon: '🏥', 
    route: '/hub/surgery-information',
    priority: 'medium'
  },
  { 
    id: 16, 
    category: 'Medications & Treatment', 
    name: 'Physical Therapy Guide', 
    description: 'Rehabilitation exercises, injury recovery, mobility improvement techniques, and therapeutic approaches.', 
    icon: '🏃‍♂️', 
    route: '/hub/physical-therapy',
    priority: 'low'
  },
  { 
    id: 17, 
    category: 'Medications & Treatment', 
    name: 'Alternative Medicine', 
    description: 'Complementary health approaches, traditional medicine practices, and integrative treatment methods.', 
    icon: '🌿', 
    route: '/hub/alternative-medicine',
    priority: 'medium'
  },
  { 
    id: 18, 
    category: 'Medications & Treatment', 
    name: 'Pain Management', 
    description: 'Chronic and acute pain relief strategies, treatment options, and coping mechanisms for better quality of life.', 
    icon: '🎯', 
    route: '/hub/pain-management',
    priority: 'high'
  },
  { 
    id: 19, 
    category: 'Medications & Treatment', 
    name: 'Rehabilitation Resources', 
    description: 'Recovery programs, therapeutic approaches, and support systems for various health conditions and injuries.', 
    icon: '💪', 
    route: '/hub/rehabilitation',
    priority: 'medium'
  },
  { 
    id: 20, 
    category: 'Medications & Treatment', 
    name: 'Vaccination Information', 
    description: 'Vaccine schedules, immunization benefits, side effects, and importance of vaccinations across all ages.', 
    icon: '💉', 
    route: '/hub/vaccination-info',
    priority: 'high'
  },

  // Nutrition & Wellness (10 features)
  { 
    id: 21, 
    category: 'Nutrition & Wellness', 
    name: 'Healthy Eating Guide', 
    description: 'Balanced nutrition principles, meal planning, portion control, and dietary guidelines for optimal health.', 
    icon: '🍎', 
    route: '/hub/healthy-eating',
    priority: 'high'
  },
  { 
    id: 22, 
    category: 'Nutrition & Wellness', 
    name: 'Food Safety Tips', 
    description: 'Safe food handling, storage guidelines, preventing foodborne illness, and kitchen hygiene practices.', 
    icon: '🛡️', 
    route: '/hub/food-safety',
    priority: 'high'
  },
  { 
    id: 23, 
    category: 'Nutrition & Wellness', 
    name: 'Weight Management', 
    description: 'Healthy weight loss and gain strategies, body composition, metabolism, and sustainable lifestyle changes.', 
    icon: '⚖️', 
    route: '/hub/weight-management',
    priority: 'medium'
  },
  { 
    id: 24, 
    category: 'Nutrition & Wellness', 
    name: 'Allergy & Food Sensitivity', 
    description: 'Food allergies identification, management strategies, alternative ingredients, and emergency preparedness.', 
    icon: '⚠️', 
    route: '/hub/food-allergies',
    priority: 'high'
  },
  { 
    id: 25, 
    category: 'Nutrition & Wellness', 
    name: 'Vitamins & Supplements', 
    description: 'Essential nutrients, supplement benefits and risks, deficiency prevention, and natural food sources.', 
    icon: '🔸', 
    route: '/hub/vitamins-supplements',
    priority: 'medium'
  },
  { 
    id: 26, 
    category: 'Nutrition & Wellness', 
    name: 'Hydration & Health', 
    description: 'Proper hydration importance, daily water needs, electrolyte balance, and signs of dehydration.', 
    icon: '💧', 
    route: '/hub/hydration-health',
    priority: 'medium'
  },
  { 
    id: 27, 
    category: 'Nutrition & Wellness', 
    name: 'Fitness & Exercise', 
    description: 'Exercise benefits, workout routines, physical activity guidelines, and staying active throughout life.', 
    icon: '🏋️‍♀️', 
    route: '/hub/fitness-exercise',
    priority: 'high'
  },
  { 
    id: 28, 
    category: 'Nutrition & Wellness', 
    name: 'Sleep Health', 
    description: 'Quality sleep importance, sleep hygiene tips, sleep disorders, and creating healthy sleep routines.', 
    icon: '😴', 
    route: '/hub/sleep-health',
    priority: 'high'
  },
  { 
    id: 29, 
    category: 'Nutrition & Wellness', 
    name: 'Stress Management', 
    description: 'Stress reduction techniques, mindfulness practices, relaxation methods, and work-life balance strategies.', 
    icon: '🧘‍♀️', 
    route: '/hub/stress-management',
    priority: 'high'
  },
  { 
    id: 30, 
    category: 'Nutrition & Wellness', 
    name: 'Healthy Aging', 
    description: 'Age-related health changes, preventive measures, maintaining independence, and healthy lifestyle choices.', 
    icon: '🌟', 
    route: '/hub/healthy-aging',
    priority: 'medium'
  },

  // Environmental Health (10 features)
  { 
    id: 31, 
    category: 'Environmental Health', 
    name: 'Air Quality & Health', 
    description: 'Air pollution effects on health, indoor air quality improvement, and respiratory protection strategies.', 
    icon: '🌬️', 
    route: '/hub/air-quality-health',
    priority: 'high'
  },
  { 
    id: 32, 
    category: 'Environmental Health', 
    name: 'Water Quality Information', 
    description: 'Clean water importance, water contamination risks, filtration options, and safe drinking practices.', 
    icon: '💧', 
    route: '/hub/water-quality-info',
    priority: 'high'
  },
  { 
    id: 33, 
    category: 'Environmental Health', 
    name: 'Sun Safety Guide', 
    description: 'UV radiation protection, sunscreen selection, skin cancer prevention, and safe sun exposure practices.', 
    icon: '☀️', 
    route: '/hub/sun-safety',
    priority: 'medium'
  },
  { 
    id: 34, 
    category: 'Environmental Health', 
    name: 'Seasonal Health Tips', 
    description: 'Weather-related health concerns, seasonal allergies, climate adaptation, and year-round wellness strategies.', 
    icon: '🌸', 
    route: '/hub/seasonal-health',
    priority: 'medium'
  },
  { 
    id: 35, 
    category: 'Environmental Health', 
    name: 'Chemical Safety Guide', 
    description: 'Household chemical safety, toxic exposure prevention, natural cleaning alternatives, and emergency procedures.', 
    icon: '🧪', 
    route: '/hub/chemical-safety',
    priority: 'medium'
  },
  { 
    id: 36, 
    category: 'Environmental Health', 
    name: 'Workplace Health', 
    description: 'Occupational safety, ergonomics, workplace injury prevention, and maintaining health while working.', 
    icon: '💼', 
    route: '/hub/workplace-health',
    priority: 'medium'
  },
  { 
    id: 37, 
    category: 'Environmental Health', 
    name: 'Climate & Health Impact', 
    description: 'Climate change health effects, adaptation strategies, extreme weather preparation, and environmental wellness.', 
    icon: '🌡️', 
    route: '/hub/climate-health-impact',
    priority: 'low'
  },
  { 
    id: 38, 
    category: 'Environmental Health', 
    name: 'Home Safety Guide', 
    description: 'Creating a safe living environment, accident prevention, childproofing, and emergency preparedness at home.', 
    icon: '🏠', 
    route: '/hub/home-safety',
    priority: 'high'
  },
  { 
    id: 39, 
    category: 'Environmental Health', 
    name: 'Travel Health Tips', 
    description: 'Health precautions for travel, vaccination requirements, food safety abroad, and staying healthy while traveling.', 
    icon: '✈️', 
    route: '/hub/travel-health',
    priority: 'low'
  },
  { 
    id: 40, 
    category: 'Environmental Health', 
    name: 'Pet Health & Safety', 
    description: 'Pet care basics, zoonotic disease prevention, animal safety, and maintaining healthy pet-owner relationships.', 
    icon: '🐕', 
    route: '/hub/pet-health-safety',
    priority: 'low'
  },

  // Healthcare Resources (10 features)
  { 
    id: 41, 
    category: 'Healthcare Resources', 
    name: 'Finding Healthcare Providers', 
    description: 'How to choose doctors, specialist referrals, healthcare quality indicators, and navigating insurance networks.', 
    icon: '👩‍⚕️', 
    route: '/hub/finding-providers',
    priority: 'high'
  },
  { 
    id: 42, 
    category: 'Healthcare Resources', 
    name: 'Health Insurance Guide', 
    description: 'Understanding health insurance, coverage options, claims process, and maximizing healthcare benefits.', 
    icon: '📋', 
    route: '/hub/health-insurance-guide',
    priority: 'high'
  },
  { 
    id: 43, 
    category: 'Healthcare Resources', 
    name: 'Medical Records Management', 
    description: 'Organizing health information, patient rights, medical history importance, and accessing your records.', 
    icon: '📁', 
    route: '/hub/medical-records',
    priority: 'medium'
  },
  { 
    id: 44, 
    category: 'Healthcare Resources', 
    name: 'Preventive Care Schedule', 
    description: 'Age-appropriate health screenings, preventive services, vaccination schedules, and wellness checkup importance.', 
    icon: '📅', 
    route: '/hub/preventive-care',
    priority: 'high'
  },
  { 
    id: 45, 
    category: 'Healthcare Resources', 
    name: 'Health Technology Tools', 
    description: 'Health apps evaluation, wearable devices, telemedicine benefits, and digital health tool selection.', 
    icon: '📱', 
    route: '/hub/health-technology',
    priority: 'medium'
  },
  { 
    id: 46, 
    category: 'Healthcare Resources', 
    name: 'Support Groups & Communities', 
    description: 'Finding peer support, online health communities, patient advocacy, and connecting with others facing similar challenges.', 
    icon: '👥', 
    route: '/hub/support-communities',
    priority: 'medium'
  },
  { 
    id: 47, 
    category: 'Healthcare Resources', 
    name: 'Health News & Research', 
    description: 'Latest medical breakthroughs, research findings, health trends, and evidence-based health information.', 
    icon: '📰', 
    route: '/hub/health-news-research',
    priority: 'high'
  },
  { 
    id: 48, 
    category: 'Healthcare Resources', 
    name: 'Women\'s Health Resources', 
    description: 'Female-specific health information, reproductive health, pregnancy care, and women\'s wellness throughout life.', 
    icon: '♀️', 
    route: '/hub/womens-health',
    priority: 'high'
  },
  { 
    id: 49, 
    category: 'Healthcare Resources', 
    name: 'Men\'s Health Resources', 
    description: 'Male-specific health concerns, preventive care for men, lifestyle factors, and addressing men\'s health stigmas.', 
    icon: '♂️', 
    route: '/hub/mens-health',
    priority: 'medium'
  },
  { 
    id: 50, 
    category: 'Healthcare Resources', 
    name: 'Health Statistics & Trends', 
    description: 'Population health data, disease prevalence, health trends analysis, and public health statistics interpretation.', 
    icon: '📊', 
    route: '/hub/health-statistics',
    priority: 'low'
  }
];

const categories = [
  'Medical Knowledge',
  'Medications & Treatment',
  'Nutrition & Wellness',
  'Environmental Health',
  'Healthcare Resources'
];

const categoryColors = {
  'Medical Knowledge': 'from-teal-500 to-emerald-500',
  'Medications & Treatment': 'from-blue-500 to-indigo-500',
  'Nutrition & Wellness': 'from-emerald-500 to-green-500',
  'Environmental Health': 'from-cyan-500 to-teal-500',
  'Healthcare Resources': 'from-indigo-500 to-purple-500'
};

const MainHubGrid = () => {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, threshold: 0.3 });
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title Section */}
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 30 }}
        animate={titleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 sm:mb-20"
      >
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-teal-100 rounded-full mb-4 sm:mb-6">
          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
          <span className="text-xs sm:text-sm font-medium text-teal-700">50+ Health Topics</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 text-slate-800">
          Health Knowledge
          <br />
          <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Library & Resources
          </span>
        </h2>
        
        <p className="text-lg sm:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed px-4">
          Comprehensive health information organized into specialized knowledge domains. 
          Access reliable medical knowledge, wellness advice, and health resources 
          through our professionally curated content library.
        </p>
      </motion.div>

      {/* Categories Grid */}
      {categories.map((category, categoryIndex) => {
        const categoryRef = useRef(null);
        const categoryInView = useInView(categoryRef, { once: true, threshold: 0.1 });
        const categoryFeatures = healthcareFeatures.filter(feature => feature.category === category);
        const categoryColor = categoryColors[category];

        return (
          <motion.div
            key={category}
            ref={categoryRef}
            initial={{ opacity: 0, y: 40 }}
            animate={categoryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
            className="mb-12 sm:mb-20"
            onHoverStart={() => setActiveCategory(category)}
            onHoverEnd={() => setActiveCategory(null)}
          >
            {/* Category Header */}
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className={`w-8 sm:w-12 h-8 sm:h-12 bg-gradient-to-r ${categoryColor} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg`}>
                  <div className="w-4 sm:w-6 h-4 sm:h-6 bg-white rounded opacity-80"></div>
                </div>
                
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1">
                    {category}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600">
                    {categoryFeatures.length} comprehensive guides available
                  </p>
                </div>
              </div>
              
              <div className={`w-16 sm:w-24 h-1 bg-gradient-to-r ${categoryColor} rounded-full`}></div>
            </div>

            {/* Features Grid - Fixed equal height and content spacing */}
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6"
              style={{ gridAutoRows: '1fr' }} // This ensures equal height
            >
              {categoryFeatures.map((feature, featureIndex) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={categoryInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: featureIndex * 0.05 }}
                  className="h-full" // Full height container
                >
                  <Link to={feature.route} className="block group h-full">
                    <div className="relative h-full flex flex-col"> {/* Flex column for proper content distribution */}
                      {/* Priority Indicator */}
                      {feature.priority === 'high' && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <div className="w-3 sm:w-4 h-3 sm:h-4 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                      )}

                      {/* Hover Glow Effect */}
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${categoryColor} rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
                     
                      {/* Card - Full height with flex layout */}
                      <div className="relative bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full hover:bg-white hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] flex flex-col">
                        {/* Icon */}
                        <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                          {feature.icon}
                        </div>

                        {/* Title */}
                        <h4 className="text-sm sm:text-base font-bold text-slate-800 mb-2 sm:mb-3 leading-tight group-hover:text-teal-700 transition-colors duration-300 flex-shrink-0">
                          {feature.name}
                        </h4>

                        {/* Description - Flex grow to fill available space */}
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 sm:mb-4 flex-grow">
                          {feature.description}
                        </p>

                        {/* Access Indicator - Always at bottom */}
                        <div className="flex items-center justify-between mt-auto flex-shrink-0">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            feature.priority === 'high' 
                              ? 'bg-red-100 text-red-700' 
                              : feature.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {feature.priority} priority
                          </span>
                          
                          <svg className="w-4 sm:w-5 h-4 sm:h-5 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MainHubGrid;
