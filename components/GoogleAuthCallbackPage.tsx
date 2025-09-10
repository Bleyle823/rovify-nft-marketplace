/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import RoviLogo from '@/public/images/contents/rovi-logo.png';
import PasswordConfirmModal from '@/components/PasswordConfirmModal';
import { useAuth } from '@/context/AuthContext';
import { getOAuthRedirectUri } from '@/utils/env';

interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    walletAddress?: string;
    baseName?: string;
    ethName?: string;
    authMethod: 'email' | 'password' | 'google' | 'base';
    [key: string]: unknown;
}

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [userData, setUserData] = useState<User | null>(null);
    const exchangeAttemptedRef = useRef(false);

    useEffect(() => {
        const handleCallback = async () => {
            if (exchangeAttemptedRef.current) return;
            exchangeAttemptedRef.current = true;

            console.log('Processing OAuth callback in client...');

            try {
                const code = searchParams?.get('code');
                const stateParam = searchParams?.get('state');

                if (!code || !stateParam) {
                    throw new Error('Missing required authentication parameters');
                }

                // Verify state matches to prevent CSRF
                const savedState = localStorage.getItem('oauth_state');
                console.log('Verifying OAuth state parameter...');

                if (stateParam !== savedState) {
                    console.error('OAuth state mismatch', { received: stateParam, saved: savedState });
                    throw new Error('Invalid authentication state');
                }

                console.log('OAuth state verified successfully');

                // Get stored PKCE verifier
                const verifier = localStorage.getItem('pkce_verifier');
                console.log('Retrieved PKCE verifier');

                if (!verifier) {
                    console.error('PKCE verifier missing');
                    throw new Error('PKCE verifier missing');
                }

                // Exchange code for tokens using the backend
                console.log('Exchanging authorization code for tokens...');
                const response = await fetch('/api/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        code,
                        codeVerifier: verifier,
                        redirectUri: getOAuthRedirectUri('google')
                    })
                });

                // Clear oauth session data after exchange
                localStorage.removeItem('oauth_state');
                localStorage.removeItem('pkce_verifier');
                console.log('Cleared OAuth session data from localStorage');

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Token exchange failed:', errorData);
                    throw new Error(errorData.message || 'Failed to authenticate with Google');
                }

                const userDataResponse = await response.json();
                console.log('User profile retrieved:', {
                    id: userDataResponse.id,
                    email: userDataResponse.email,
                    name: userDataResponse.name || 'N/A'
                });

                // Store user data for the password confirmation
                setUserData(userDataResponse);

                // Show password confirmation modal
                setShowPasswordModal(true);

            } catch (error) {
                console.error('Authentication callback error:', error);
                setError(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
                setTimeout(() => router.push('/auth/login'), 3000);
            }
        };

        if (searchParams && !exchangeAttemptedRef.current) {
            handleCallback();
        }
    }, [searchParams, router]);

    // Handle password confirmation
    const handlePasswordConfirm = async (password: string) => {
        if (!userData) {
            setError('User data is missing. Please try logging in again.');
            setTimeout(() => router.push('/auth/login'), 3000);
            return;
        }

        try {
            // Verify password with your backend
            const response = await fetch('/api/auth/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userData.email || '',
                    password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Invalid password');
            }

            // If verification successful, complete the login process
            await login(userData);

            // Set auth cookies
            document.cookie = `rovify-auth-token=${userData.id}; path=/; secure; samesite=strict; max-age=${60 * 60 * 24 * 7}`; // 7 days
            console.log('Auth token set in cookie');

            // Redirect to home
            console.log('Authentication successful, redirecting to home');
            window.history.replaceState({}, document.title, window.location.pathname);
            router.push('/home');
        } catch (error) {
            // Password verification failed, throw error to be handled by the modal
            throw error;
        }
    };

    // Handle cancellation of password verification
    const handleCancel = () => {
        // Redirect back to login
        router.push('/auth/login');
    };

    if (error) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-white">
                <div className="max-w-md w-full p-6 bg-red-50 rounded-xl shadow-sm text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Failed</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-500">Redirecting to login page...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
                <div className="flex flex-col items-center">
                    <div className="h-16 w-16 bg-[#FF5722] rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FF5722] to-[#FF7A50]"></div>
                        <div className="relative z-10">
                            <Image
                                // src={RoviLogo}
                                src="/images/contents/rovi-logo.png"
                                alt="Rovify Logo"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <h2 className="mt-6 text-xl font-bold text-gray-800">Authenticating</h2>
                    <div className="mt-4 flex space-x-2">
                        <div className="h-2 w-2 bg-[#FF5722] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="h-2 w-2 bg-[#FF5722] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="h-2 w-2 bg-[#FF5722] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <p className="mt-4 text-gray-500 max-w-xs text-center">
                        Completing your authentication. Please wait...
                    </p>
                </div>
            </div>

            {/* Password confirmation modal */}
            {showPasswordModal && userData && (
                <PasswordConfirmModal
                    email={userData.email || ''}
                    onConfirmAction={handlePasswordConfirm}
                    onCancelAction={handleCancel}
                />
            )}
        </>
    );
}