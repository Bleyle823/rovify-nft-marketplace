// components/ErrorBoundary.tsx
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';
import { FiHome, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Caught error:', error, errorInfo);
        // You could also log the error to an error reporting service here
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen w-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4">
                    {/* Animated background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
                        <div className="absolute -bottom-48 left-0 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-reverse"></div>
                    </div>

                    <div className="glass-card rounded-2xl shadow-xl p-8 border border-white/50 max-w-md z-10 w-full relative overflow-hidden">
                        <div className="text-center relative z-10">
                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                                    <FiAlertTriangle className="w-10 h-10 text-[#FF5722]" />
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Component Error</h1>

                            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                                We&apos;ve encountered an error in this component. This is usually temporary and can be resolved by refreshing.
                            </p>

                            {/* Error details for development */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                                    <p className="text-sm font-medium text-gray-700">Error details:</p>
                                    <p className="text-xs text-gray-600 mt-1 break-words font-mono">{this.state.error.message}</p>
                                    <p className="text-xs text-gray-500 mt-2">{this.state.error.stack?.split('\n')[0]}</p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={this.handleReset}
                                    className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors neumorph-button"
                                >
                                    <FiRefreshCw className="w-4 h-4" />
                                    Retry
                                </button>

                                <Link
                                    href="/"
                                    className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF7A50] text-white font-medium shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-0.5"
                                >
                                    <FiHome className="w-4 h-4" />
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Custom styles */}
                    <style jsx global>{`
            .glass-card {
              background: rgba(255, 255, 255, 0.85);
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
            }
            
            .neumorph-button {
              box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.05),
                         -4px -4px 8px rgba(255, 255, 255, 0.5);
              transition: all 0.3s ease;
            }
            
            @keyframes float {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              50% { transform: translate(-20px, -15px) rotate(5deg); }
            }
            
            @keyframes float-reverse {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              50% { transform: translate(20px, 10px) rotate(-5deg); }
            }
            
            .animate-float {
              animation: float 15s ease-in-out infinite;
            }
            
            .animate-float-reverse {
              animation: float-reverse 15s ease-in-out infinite;
            }
          `}</style>
                </div>
            );
        }

        return this.props.children;
    }
}