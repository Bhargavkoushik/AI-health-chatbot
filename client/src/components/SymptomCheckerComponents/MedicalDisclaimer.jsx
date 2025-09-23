// client/src/components/SymptomCheckerComponents/MedicalDisclaimer.jsx
import React, { useState } from 'react';

const MedicalDisclaimer = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 mx-4">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.865-.833-2.635 0L4.178 16.5C3.408 18.333 4.369 20 5.909 20z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-800 mb-1">Medical Disclaimer</h3>
                    <p className="text-sm text-amber-700 leading-relaxed">
                        This AI assistant provides educational health information only and should not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns.
                    </p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 p-1 text-amber-600 hover:text-amber-800 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default MedicalDisclaimer;
