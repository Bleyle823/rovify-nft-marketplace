// app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FiHome, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-24 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
                <div className="absolute -bottom-48 left-0 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-reverse"></div>

                {/* Decorative grid background */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] rotate-3"></div>
            </div>

            <div className="glass-card rounded-2xl shadow-xl p-8 border border-white/50 max-w-md z-10 w-full relative overflow-hidden">
                {/* Card background decoration */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#FF5722]/10 rounded-full"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#FF5722]/10 rounded-full"></div>

                <div className="text-center relative z-10">
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                            <FiAlertTriangle className="w-10 h-10 text-[#FF5722]" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>

                    <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                        We apologize for the inconvenience. An unexpected error has occurred. Our team has been notified.
                    </p>

                    {/* Error details for development */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                            <p className="text-sm font-medium text-gray-700">Error details:</p>
                            <p className="text-xs text-gray-600 mt-1 break-words font-mono">{error.message}</p>
                            {error.digest && (
                                <p className="text-xs text-gray-500 mt-2">Digest: {error.digest}</p>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={reset}
                            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium whitespace-nowrap hover:bg-gray-50 transition-colors neumorph-button"
                        >
                            <FiRefreshCw className="w-4 h-4 flex-shrink-0" />
                            <span>Try Again</span>
                        </button>

                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF7A50] text-white font-medium whitespace-nowrap shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-0.5"
                        >
                            <FiHome className="w-4 h-4 flex-shrink-0" />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Custom styles */}
            <style jsx global>{`
        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
        }
        
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
        
        .neumorph-button:active {
          box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.05),
                     inset -2px -2px 4px rgba(255, 255, 255, 0.5);
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