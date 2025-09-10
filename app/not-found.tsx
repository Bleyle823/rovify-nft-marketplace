// app/not-found.tsx
'use client';

import Link from 'next/link';
import { FiHome, FiMap, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-48 right-0 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-reverse"></div>

        {/* Decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[500px] h-[500px] opacity-[0.03]">
            <div className="absolute inset-0 border-2 border-dashed border-black rounded-full animate-spin-slow"></div>
            <div className="absolute inset-10 border-2 border-dashed border-black rounded-full animate-spin-slow-reverse"></div>
            <div className="absolute inset-20 border-2 border-dashed border-black rounded-full animate-spin-slow"></div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl shadow-xl p-8 border border-white/50 max-w-md z-10 w-full relative overflow-hidden">
        {/* Card background decoration */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#FF5722]/10 rounded-full"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#FF5722]/10 rounded-full"></div>

        <div className="text-center relative z-10">
          {/* 404 Display */}
          <div className="relative mb-6">
            <h1 className="text-[120px] font-bold text-[#FF5722]/10 leading-none">404</h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF5722] to-[#FF7A50]">Page Not Found</h2>
            </div>
          </div>

          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            We couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors neumorph-button"
            >
              <FiArrowLeft className="w-4 h-4 flex-shrink-0" />
              <span>Go Back</span>
            </button>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FF7A50] text-white text-sm font-medium whitespace-nowrap shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-0.5"
            >
              <FiHome className="w-4 h-4 flex-shrink-0" />
              <span>Home</span>
            </Link>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-[#FF5722]/10 text-[#FF5722] text-sm font-medium whitespace-nowrap hover:bg-[#FF5722]/20 transition-colors"
            >
              <FiMap className="w-4 h-4 flex-shrink-0" />
              <span>Explore Events</span>
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
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 120s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 80s linear infinite;
        }
      `}</style>
    </div>
  );
}