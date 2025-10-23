import React, { useState, useEffect } from 'react';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedCard from '../components/AnimatedCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SuccessMessage from '../components/SuccessMessage';
import ErrorMessage from '../components/ErrorMessage';

const AnimationDemo = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [scrollRef, isVisible] = useScrollAnimation({ threshold: 0.1 });
    const [cardRef, cardVisible] = useScrollAnimation({ threshold: 0.2 });
    const [buttonRef, buttonVisible] = useScrollAnimation({ threshold: 0.3 });

    const staggeredItems = useStaggeredAnimation([
        'Animation 1', 'Animation 2', 'Animation 3', 'Animation 4'
    ], 200);

    const handleSuccess = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleError = () => {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
    };

    const handleLoading = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in-down gradient-text">
                        Animation Showcase
                    </h1>
                    <p className="text-xl text-gray-600 animate-fade-in-up animate-delay-300">
                        Modern animations and micro-interactions for a contemporary user experience
                    </p>
                </div>

                {/* Scroll Animation Demo */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in-left">
                        Scroll-Triggered Animations
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div 
                            ref={scrollRef}
                            className={`p-8 bg-white rounded-2xl shadow-lg transition-all duration-1000 ${
                                isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
                            }`}
                        >
                            <h3 className="text-xl font-semibold mb-4">Fade In Up</h3>
                            <p className="text-gray-600">This card animates when it comes into view</p>
                        </div>
                        
                        <div 
                            ref={cardRef}
                            className={`p-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg transition-all duration-1000 ${
                                cardVisible ? 'animate-fade-in-scale opacity-100' : 'opacity-0 scale-90'
                            }`}
                        >
                            <h3 className="text-xl font-semibold mb-4">Scale Animation</h3>
                            <p>This card scales in when visible</p>
                        </div>
                        
                        <div 
                            ref={buttonRef}
                            className={`p-8 bg-white rounded-2xl shadow-lg transition-all duration-1000 ${
                                buttonVisible ? 'animate-fade-in-right opacity-100' : 'opacity-0 -translate-x-8'
                            }`}
                        >
                            <h3 className="text-xl font-semibold mb-4">Slide In Right</h3>
                            <p className="text-gray-600">This card slides in from the right</p>
                        </div>
                    </div>
                </section>

                {/* Interactive Components */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in-left">
                        Interactive Components
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Animated Buttons */}
                        <AnimatedCard className="p-8">
                            <h3 className="text-xl font-semibold mb-6">Animated Buttons</h3>
                            <div className="space-y-4">
                                <AnimatedButton 
                                    variant="primary" 
                                    onClick={handleSuccess}
                                    className="w-full"
                                >
                                    Success Button
                                </AnimatedButton>
                                <AnimatedButton 
                                    variant="secondary" 
                                    onClick={handleError}
                                    className="w-full"
                                >
                                    Error Button
                                </AnimatedButton>
                                <AnimatedButton 
                                    variant="success" 
                                    onClick={handleLoading}
                                    loading={loading}
                                    className="w-full"
                                >
                                    Loading Button
                                </AnimatedButton>
                                <AnimatedButton 
                                    variant="glass" 
                                    className="w-full"
                                >
                                    Glass Button
                                </AnimatedButton>
                            </div>
                        </AnimatedCard>

                        {/* Loading States */}
                        <AnimatedCard className="p-8">
                            <h3 className="text-xl font-semibold mb-6">Loading States</h3>
                            <div className="space-y-6">
                                <LoadingSpinner size="small" text="Small Loading" />
                                <LoadingSpinner size="medium" text="Medium Loading" color="purple" />
                                <LoadingSpinner size="large" text="Large Loading" color="pink" />
                            </div>
                        </AnimatedCard>
                    </div>
                </section>

                {/* Staggered Animations */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in-left">
                        Staggered Animations
                    </h2>
                    <div className="grid md:grid-cols-4 gap-4">
                        {staggeredItems.map((item, index) => (
                            <div 
                                key={index}
                                className="p-6 bg-white rounded-xl shadow-lg animate-fade-in-up"
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                <h4 className="font-semibold text-gray-900">{item}</h4>
                                <p className="text-sm text-gray-600 mt-2">Staggered animation</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Hover Effects */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in-left">
                        Hover Effects
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 bg-white rounded-2xl shadow-lg hover-float">
                            <h3 className="text-xl font-semibold mb-4">Float Effect</h3>
                            <p className="text-gray-600">Hover to see floating animation</p>
                        </div>
                        
                        <div className="p-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg hover-pulse-glow">
                            <h3 className="text-xl font-semibold mb-4">Pulse Glow</h3>
                            <p>Hover to see pulsing glow effect</p>
                        </div>
                        
                        <div className="p-8 bg-white rounded-2xl shadow-lg hover-wiggle">
                            <h3 className="text-xl font-semibold mb-4">Wiggle Effect</h3>
                            <p className="text-gray-600">Hover to see wiggle animation</p>
                        </div>
                    </div>
                </section>

                {/* Glassmorphism */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in-left">
                        Modern Effects
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="glass p-8 rounded-2xl">
                            <h3 className="text-xl font-semibold mb-4 text-white">Glassmorphism</h3>
                            <p className="text-white/80">Modern glass effect with backdrop blur</p>
                        </div>
                        
                        <div className="p-8 bg-white rounded-2xl shadow-lg neon-glow text-indigo-600">
                            <h3 className="text-xl font-semibold mb-4">Neon Glow</h3>
                            <p className="text-gray-600">Neon glow effect for modern appeal</p>
                        </div>
                    </div>
                </section>

                {/* Messages */}
                {showSuccess && (
                    <SuccessMessage 
                        message="Operation completed successfully!" 
                        onClose={() => setShowSuccess(false)}
                        show={showSuccess}
                    />
                )}
                
                {showError && (
                    <ErrorMessage 
                        message="Something went wrong. Please try again." 
                        onClose={() => setShowError(false)}
                        show={showError}
                    />
                )}
            </div>
        </div>
    );
};

export default AnimationDemo;
