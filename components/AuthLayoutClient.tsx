'use client';

import { ReactNode } from 'react';

export default function AuthLayoutClient({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white to-gray-100">
      {children}

      {/* Global Auth Styles */}
      <style jsx global>{`
                .bg-grid-pattern {
                  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
                }
                
                .glass-card {
                  background: rgba(255, 255, 255, 0.85);
                  backdrop-filter: blur(10px);
                  -webkit-backdrop-filter: blur(10px);
                }
                
                .neumorph-input {
                  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.05), 
                             inset -2px -2px 5px rgba(255, 255, 255, 0.5);
                  transition: all 0.3s ease;
                }
                
                .neumorph-input:focus {
                  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.05), 
                             inset -1px -1px 2px rgba(255, 255, 255, 0.5);
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
                
                @keyframes float-reverse {
                  0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                  }
                  50% {
                    transform: translate(20px, 10px) rotate(-5deg);
                  }
                }
                
                .animate-float-reverse {
                  animation: float-reverse 15s ease-in-out infinite;
                }
            `}</style>
    </div>
  );
}