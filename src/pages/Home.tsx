import React, { useState } from 'react';
import { Star, Play } from 'lucide-react';

interface RatingProps {
    rating: number;
    platform: string;
    reviews: string;
}

const Rating: React.FC<RatingProps> = ({ rating, platform, reviews }) => (
    <div className="flex items-center space-x-1 text-white/80">
        <Star className="w-4 h-4 fill-white-400 text-white-400" />
        <span className="text-sm font-medium">{rating} rating on</span>
        <span className="text-sm font-semibold text-white">{platform}</span>
        <Star className="w-4 h-4 fill-grey-400 text-white-400 ml-2" />
        <span className="text-sm">{reviews} reviews on</span>
        <span className="text-sm font-semibold text-white">G2</span>
    </div>
);

interface HoverImageProps {
    type: 'reports' | 'forecasts' | 'dashboards' | 'consolidations';
    isVisible: boolean;
}

const HoverImage: React.FC<HoverImageProps> = ({ type, isVisible }) => {
    const getImageContent = () => {
        switch (type) {
            case 'reports':
                return (
                    <div className="w-48 h-32 bg-slate-800/90 rounded-lg border border-slate-600/50 p-4">
                        <div className="h-full flex flex-col">
                            <div className="h-3 bg-blue-400 rounded mb-2"></div>
                            <div className="flex-1 space-y-1">
                                <div className="h-2 bg-slate-600 rounded w-3/4"></div>
                                <div className="h-2 bg-slate-600 rounded w-1/2"></div>
                                <div className="h-2 bg-slate-600 rounded w-2/3"></div>
                            </div>
                            <div className="text-xs text-slate-300 mt-2">Financial Reports</div>
                        </div>
                    </div>
                );
            case 'forecasts':
                return (
                    <div className="w-48 h-32 bg-slate-800/90 rounded-lg border border-slate-600/50 p-4">
                        <div className="h-full flex flex-col">
                            <div className="flex-1 relative">
                                <svg className="w-full h-full" viewBox="0 0 100 50">
                                    <polyline
                                        points="10,40 30,25 50,30 70,15 90,20"
                                        fill="none"
                                        stroke="#60a5fa"
                                        strokeWidth="2"
                                    />
                                    <circle cx="10" cy="40" r="2" fill="#60a5fa" />
                                    <circle cx="30" cy="25" r="2" fill="#60a5fa" />
                                    <circle cx="50" cy="30" r="2" fill="#60a5fa" />
                                    <circle cx="70" cy="15" r="2" fill="#60a5fa" />
                                    <circle cx="90" cy="20" r="2" fill="#60a5fa" />
                                </svg>
                            </div>
                            <div className="text-xs text-slate-300">Revenue Forecast</div>
                        </div>
                    </div>
                );
            case 'dashboards':
                return (
                    <div className="w-48 h-32 bg-slate-800/90 rounded-lg border border-slate-600/50 p-4">
                        <div className="h-full flex flex-col space-y-2">
                            <div className="flex space-x-2">
                                <div className="w-16 h-8 bg-blue-500/30 rounded flex items-center justify-center">
                                    <div className="w-8 h-1 bg-blue-400 rounded"></div>
                                </div>
                                <div className="w-16 h-8 bg-green-500/30 rounded flex items-center justify-center">
                                    <div className="w-8 h-1 bg-green-400 rounded"></div>
                                </div>
                            </div>
                            <div className="flex-1 bg-slate-700/50 rounded p-2">
                                <div className="w-full h-2 bg-slate-500 rounded mb-1"></div>
                                <div className="w-2/3 h-2 bg-slate-500 rounded"></div>
                            </div>
                            <div className="text-xs text-slate-300">KPI Dashboard</div>
                        </div>
                    </div>
                );
            case 'consolidations':
                return (
                    <div className="w-48 h-32 bg-slate-800/90 rounded-lg border border-slate-600/50 p-4">
                        <div className="h-full flex flex-col">
                            <div className="flex space-x-1 mb-2">
                                <div className="w-6 h-6 bg-blue-500/30 rounded border border-blue-400/50"></div>
                                <div className="w-6 h-6 bg-green-500/30 rounded border border-green-400/50"></div>
                                <div className="w-6 h-6 bg-purple-500/30 rounded border border-purple-400/50"></div>
                            </div>
                            <div className="text-center text-slate-400 text-xs mb-1">↓</div>
                            <div className="w-full h-8 bg-gradient-to-r from-blue-500/20 via-green-500/20 to-purple-500/20 rounded border border-slate-500/50"></div>
                            <div className="text-xs text-slate-300 mt-2">Data Consolidation</div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div
            className={`absolute z-20 transition-all duration-300 pointer-events-none ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
            style={{
                transform: 'translate(-50%, -120%)',
                left: '50%',
            }}
        >
            {getImageContent()}
        </div>
    );
};

interface HoverWordProps {
    children: React.ReactNode;
    type: 'reports' | 'forecasts' | 'dashboards' | 'consolidations';
}

const HoverWord: React.FC<HoverWordProps> = ({ children, type }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <span
            className="relative inline-block transition-colors duration-200 hover:text-blue-300 cursor-default"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <HoverImage type={type} isVisible={isHovered} />
            {children}
        </span>
    );
};

const BackgroundElements: React.FC = () => (
    <>
        {/* Blurred background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-teal-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-orange-500/15 rounded-full blur-2xl"></div>

        {/* Invisible chart elements that appear on hover */}
        <div className="absolute top-16 left-16 opacity-0 hover:opacity-20 transition-opacity duration-500">
            <div className="w-48 h-32 bg-slate-800/20 rounded-lg backdrop-blur-sm border border-slate-600/20 p-4">
                <div className="w-full h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded"></div>
                <div className="mt-2 space-y-1">
                    <div className="h-2 bg-slate-500/30 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-500/30 rounded w-1/2"></div>
                </div>
            </div>
        </div>

        <div className="absolute top-16 left-28 opacity-0 hover:opacity-20 transition-opacity duration-500">
            <div className="w-48 h-32 bg-slate-800/20 rounded-lg backdrop-blur-sm border border-slate-600/20 p-4">
                <div className="w-full h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded"></div>
                <div className="mt-2 space-y-1">
                    <div className="h-2 bg-slate-500/30 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-500/30 rounded w-1/2"></div>
                </div>
            </div>
        </div>

        <div className="absolute top-32 right-32 opacity-0 hover:opacity-20 transition-opacity duration-500">
            <div className="w-40 h-24 bg-slate-800/20 rounded-lg backdrop-blur-sm border border-slate-600/20 p-3">
                <svg className="w-full h-12" viewBox="0 0 100 30">
                    <polyline
                        points="10,25 30,15 50,20 70,10 90,15"
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="1"
                        opacity="0.5"
                    />
                </svg>
                <div className="h-1 bg-slate-500/30 rounded w-2/3 mt-1"></div>
            </div>
        </div>

        <div className="absolute bottom-32 right-16 opacity-0 hover:opacity-20 transition-opacity duration-500">
            <div className="w-36 h-36 bg-slate-800/20 rounded-full backdrop-blur-sm border border-slate-600/20 p-4 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-blue-400/30 rounded-full border-t-blue-400/60 animate-spin"></div>
            </div>
        </div>
    </>
);

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 relative overflow-hidden">
            <BackgroundElements />

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
                {/* Ratings */}
                <div className="mb-8 flex flex-wrap justify-center gap-8">
                    <Rating rating={4.8} platform="Capterra" reviews="350+ reviews on Xero" />
                    <div className="text-white/80 text-sm">
                        <Star className="w-4 h-4 fill-white-400 text-white-400 inline mr-1" />
                        550+ reviews on
                        <span className="font-semibold text-white ml-1">TrustPilot</span>
                    </div>
                </div>

                {/* Main heading */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight max-w-5xl">
                    Create <HoverWord type="reports">reports</HoverWord>,{' '}
                    <HoverWord type="forecasts">forecasts</HoverWord>,
                    <br />
                    <HoverWord type="dashboards">dashboards</HoverWord> &{' '}
                    <HoverWord type="consolidations">consolidations</HoverWord>
                </h1>

                {/* AI insights badge */}
                <div className="flex items-center space-x-2 text-amber-300 mb-8">
                    <span className="text-2xl">✨</span>
                    <span className="text-lg font-medium">Now with AI-insights</span>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-4 items-center">
                    <button className="bg-gradient-to-b from-blue-200 to-white hover:from-blue-300 hover:to-gray-100 text-slate-900 font-semibold px-8 py-4 rounded-lg transition-all duration-200 text-lg">
                        Start 14-day free trial
                    </button>

                    <button className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors duration-200">
                        <Play className="w-5 h-5" />
                        <span className="underline font-medium">See what we do</span>
                    </button>
                </div>

                {/* Left side dashboard preview */}
                <div className="absolute left-8 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100 transition-opacity duration-300 hidden lg:block">
                    <div className="w-48 h-64 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-600/30 p-6">
                        <div className="space-y-4">
                            <div className="h-3 bg-slate-600/50 rounded w-3/4"></div>

                            {/* Pie chart representation */}
                            <div className="w-20 h-20 mx-auto relative">
                                <div className="w-full h-full rounded-full border-8 border-slate-600/30 border-t-blue-400 border-r-green-400"></div>
                            </div>

                            {/* Legend */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                    <div className="h-2 bg-slate-600/50 rounded flex-1"></div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                    <div className="h-2 bg-slate-600/50 rounded flex-1"></div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                    <div className="h-2 bg-slate-600/50 rounded flex-1"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side decorative element */}
                <div className="absolute right-8 bottom-20 opacity-60 hover:opacity-100 transition-opacity duration-300 hidden lg:block">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-full backdrop-blur-sm border border-orange-400/20"></div>
                </div>

                {/* Bottom right small element */}
                <div className="absolute bottom-8 right-8 opacity-40 hover:opacity-80 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-white/10 rounded border border-white/20"></div>
                </div>
            </div>
        </div>
    );
};

export default Home;
