/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

export default function RootPage() {
  const { isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('ROOT: Page rendered, user:', user ? 'authenticated' : 'not authenticated');
    
    // Only redirect authenticated users to home
    // Unauthenticated users will be handled by middleware
    if (!isLoading && user) {
      console.log('ROOT: Redirecting authenticated user to home');
      router.push('/home');
    }
  }, [isLoading, user, router]);

  // Show loading while checking authentication
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 bg-gradient-to-br from-[#FF5722] to-[#FF7A50] rounded-xl flex items-center justify-center shadow-lg animate-pulse">
          <Image
            // src={RoviLogo}
            src="/images/contents/rovi-logo.png"
            alt="Rovify Logo"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    </div>
  );
}