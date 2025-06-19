import { useState, useEffect } from 'react';

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsComplete(true);
                    // Start the zoom animation after a brief pause
                    setTimeout(() => {
                        setShowContent(true);
                        // Call parent callback after animation starts
                        setTimeout(() => {
                            if (onLoadingComplete) onLoadingComplete();
                        }, 800);
                    }, 300);
                    return 100;
                }
                return prev + Math.random() * 6 + 2;
            });
        }, 80);

        return () => clearInterval(interval);
    }, [onLoadingComplete]);

    if (showContent) {
        return null; // Component removes itself after animation
    }

    return (
        <div className="fixed inset-0 z-50 bg-black overflow-hidden">
            {/* Main loading container */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Loading bar container */}
                <div className="relative w-80 md:w-96">
                    {/* Percentage display above bar */}
                    <div className="text-center mb-8">
                        <span className="text-4xl md:text-5xl font-bold text-white">
                            {Math.floor(progress)}%
                        </span>
                    </div>

                    {/* Main loading bar */}
                    <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden">
                        {/* Progress fill */}
                        <div
                            className={`h-full bg-white transition-all duration-300 ease-out relative ${isComplete ? 'animate-pulse' : ''
                                }`}
                            style={{ width: `${progress}%` }}
                        >
                            {/* White content that will expand */}
                            <div
                                className={`absolute inset-0 bg-blue transition-all duration-1000 ease-in-out ${isComplete
                                    ? 'scale-x-[200] scale-y-[100] opacity-100'
                                    : 'scale-x-100 scale-y-100 opacity-100'
                                    }`}
                                style={{
                                    transformOrigin: 'left center',
                                }}
                            />

                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50 animate-pulse" />
                        </div>
                    </div>

                    {/* Loading text */}
                    <div className="text-center mt-6">
                        <span className="text-white text-sm md:text-base font-light tracking-wider">
                            {progress < 100 ? 'Loading...' : 'Complete'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Expanding white overlay for zoom effect */}
            <div
                className={`absolute inset-0 bg-white transition-all duration-1000 ease-in-out ${isComplete
                    ? 'scale-150 opacity-100'
                    : 'scale-0 opacity-0'
                    }`}
                style={{
                    transformOrigin: 'center center',
                }}
            />
        </div>
    );
};

export default LoadingScreen;
