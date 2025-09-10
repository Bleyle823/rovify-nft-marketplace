'use client';

import Link from 'next/link';
import { FiHome, FiLock, FiLogIn } from 'react-icons/fi';

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-24 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
                <div className="absolute -bottom-48 right-0 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-reverse"></div>
            </div>

            <div className="glass-card rounded-2xl shadow-xl p-8 border border-white/50 max-w-md z-10 w-full relative overflow-hidden">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#FF5722]/10 rounded-full"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#FF5722]/10 rounded-full"></div>

                <div className="text-center relative z-10">
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
                            <FiLock className="w-10 h-10 text-[#FF5722]" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>

                    <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                        You don&apos;t have permission to access this page. Please log in with an account that has the necessary permissions.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/auth/login"
                            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF7A50] text-white font-medium whitespace-nowrap shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-0.5"
                        >
                            <FiLogIn className="w-4 h-4 flex-shrink-0" />
                            <span>Log In</span>
                        </Link>

                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium whitespace-nowrap hover:bg-gray-50 transition-colors neumorph-button"
                        >
                            <FiHome className="w-4 h-4 flex-shrink-0" />
                            <span>Home</span>
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