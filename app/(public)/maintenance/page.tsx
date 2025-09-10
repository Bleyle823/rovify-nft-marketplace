/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import { FiClock, FiTwitter, FiMail } from 'react-icons/fi';

export default function MaintenancePage() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-24 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
                <div className="absolute -bottom-48 left-0 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-reverse"></div>

                {/* Animated circles */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#FF5722]/40 rounded-full animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#FF5722]/40 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-[#FF5722]/40 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/3 w-5 h-5 bg-[#FF5722]/40 rounded-full animate-pulse"></div>
                </div>
            </div>

            <div className="glass-card rounded-2xl shadow-xl p-8 border border-white/50 max-w-lg z-10 w-full relative overflow-hidden text-center">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#FF5722]/10 rounded-full"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#FF5722]/10 rounded-full"></div>

                <div className="relative z-10">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="h-12 w-12 bg-gradient-to-br from-[#FF5722] to-[#FF7A50] rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-2xl">R</span>
                            </div>
                            <span className="text-2xl font-bold text-[#FF5722]">rovify</span>
                        </div>
                    </div>

                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-dashed border-[#FF5722] flex items-center justify-center animate-spin-slow">
                                <div className="w-20 h-20 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
                                    <FiClock className="w-10 h-10 text-[#FF5722]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-2">We&apos;re Upgrading!</h1>

                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Rovify is currently undergoing scheduled maintenance. We&apos;re working hard to improve your experience and will be back shortly.
                    </p>

                    {/* Estimated time */}
                    <div className="bg-white/50 backdrop-blur-sm py-3 px-4 rounded-xl mb-6 inline-block">
                        <p className="text-sm text-gray-700">
                            <span className="font-medium">Estimated completion:</span> May 15, 2025 at 3:00 PM UTC
                        </p>
                    </div>

                    {/* Social links */}
                    <div className="mb-6">
                        <p className="mb-3 text-gray-600">For updates, follow us on:</p>
                        <div className="flex justify-center gap-4">
                            <a
                                href="https://twitter.com/rovify"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-colors neumorph-button"
                            >
                                <FiTwitter className="w-5 h-5" />
                            </a>

                            <a
                                href="mailto:support@rovify.io"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-[#FF5722] hover:bg-[#FF5722] hover:text-white transition-colors neumorph-button"
                            >
                                <FiMail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">
                        Thank you for your patience while we make Rovify even better!
                    </p>
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
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
        </div>
    );
}