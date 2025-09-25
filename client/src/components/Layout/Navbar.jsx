import React, { useState } from "react";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // SVG Icon components for clarity and reuse
    const StethoscopeIcon = () => (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0021.5 5.5V3.935m-13.483 0a1.5 1.5 0 01-1.06.44m1.06-.44l-.25 1.007a1.5 1.5 0 01-2.927 0l-.25-1.007m3.427 0a1.5 1.5 0 00-1.06-.44m1.06.44a1.5 1.5 0 011.06.44m0 0l.25 1.007a1.5 1.5 0 012.927 0l.25-1.007M10.5 8h4.5a2 2 0 110 4h-4.5a2 2 0 110-4z"></path></svg>
    );

    const UserGroupIcon = () => (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
    );

    const CodeBracketIcon = () => (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 12"></path></svg>
    );

    const MapIcon = () => (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
    );
    
    const HeartIcon = () => (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    );

    const HomeIcon = () => (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
    );

    const PrescriptionIcon = () => (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
    );

    const NavLink = ({ href, children, isCurrent }) => (
        <a href={href} className={`relative group px-3 py-2 rounded-lg transition-all duration-200 ${
            isCurrent 
                ? 'bg-red-50 text-red-600' 
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
        }`}>
            <span className="flex items-center text-sm font-medium">
                {children}
            </span>
        </a>
    );

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-[0px_2px_10px_rgba(0,0,0,0.1)] border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Logo - Optimized spacing */}
                    <a href="/" className="group inline-block text-slate-800 hover:text-slate-900 transition-colors duration-300 flex-shrink-0">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            {/* Logo SVG Icon */}
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM17 13h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                                <path d="M15.24 7.24l-2.47 2.47-1.41-1.41-1.06 1.06 2.47 2.47-2.47 2.47 1.06 1.06 2.47-2.47 2.47 2.47 1.06-1.06-2.47-2.47 2.47-2.47-1.06-1.06-2.47 2.47z" opacity="0.5"/>
                            </svg>
                            <div className="hidden xs:block">
                                <div className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover:from-red-600 group-hover:to-red-700 transition-all duration-300">
                                    MediBot
                                </div>
                                <div className="text-xs font-medium text-slate-500 tracking-widest uppercase -mt-0.5 hidden sm:block group-hover:text-red-500 transition-colors duration-300">
                                    AI Health Assistant
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Desktop Navigation - ALL OPTIONS INCLUDED */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        <NavLink href="/" isCurrent={window.location.pathname === '/'}>
                            <HomeIcon /> Overview
                        </NavLink>
                        <NavLink href="/symptom-checker" isCurrent={window.location.pathname === '/symptom-checker'}>
                            <StethoscopeIcon /> Symptom Checker
                        </NavLink>
                        <NavLink href="/prescription-analyzer" isCurrent={window.location.pathname === '/prescription-analyzer'}>
                            <PrescriptionIcon /> Prescription Analyzer
                        </NavLink>
                        <NavLink href="/doctor-recommender">
                            <UserGroupIcon /> Doctor Recommender
                        </NavLink>
                        <NavLink href="/tech-stack">
                            <CodeBracketIcon /> Tech Stack
                        </NavLink>
                        <NavLink href="/wellness-hub">
                            <HeartIcon /> Wellness Hub
                        </NavLink>
                        <NavLink href="/human-body-explorer">
                            <HeartIcon /> Body Explorer
                        </NavLink>
                        <NavLink href="/air-quality-forecaster">
                            <MapIcon /> Air Quality
                        </NavLink>
                        <NavLink href="/roadmap">
                            <MapIcon /> Roadmap
                        </NavLink>
                        <NavLink href="/contribute">
                            <HeartIcon /> Contribute
                        </NavLink>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation - ALL OPTIONS INCLUDED */}
                {isMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
                        <div className="py-3 space-y-1 max-h-96 overflow-y-auto">
                            <NavLink href="/" isCurrent={window.location.pathname === '/'}>
                                <HomeIcon /> Overview
                            </NavLink>
                            <NavLink href="/symptom-checker" isCurrent={window.location.pathname === '/symptom-checker'}>
                                <StethoscopeIcon /> Symptom Checker
                            </NavLink>
                            <NavLink href="/prescription-analyzer" isCurrent={window.location.pathname === '/prescription-analyzer'}>
                                <PrescriptionIcon /> Prescription Analyzer
                            </NavLink>
                            <NavLink href="/doctor-recommender">
                                <UserGroupIcon /> Doctor Recommender
                            </NavLink>
                            <NavLink href="/tech-stack">
                                <CodeBracketIcon /> Tech Stack
                            </NavLink>
                            <NavLink href="/wellness-hub">
                                <HeartIcon /> Wellness Hub
                            </NavLink>
                            <NavLink href="/human-body-explorer">
                                <HeartIcon /> Body Explorer
                            </NavLink>
                            <NavLink href="/air-quality-forecaster">
                                <MapIcon /> Air Quality
                            </NavLink>
                            <NavLink href="/roadmap">
                                <MapIcon /> Roadmap
                            </NavLink>
                            <NavLink href="/contribute">
                                <HeartIcon /> Contribute
                            </NavLink>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
