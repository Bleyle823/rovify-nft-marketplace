/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // For demo, we'll just show success message
            setSuccess(true);
        } catch (err) {
            setError('Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-24 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
                <div className="absolute -bottom-48 right-0 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-reverse"></div>

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
            </div>

            <div className="w-full max-w-md z-10">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-[#FF5722] rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
                            <Image
                                // src={RoviLogo}
                                src="/images/contents/rovi-logo.png"
                                alt="Rovify Logo"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                        </div>
                        <span className="text-2xl font-bold text-[#FF5722]">rovify</span>
                    </div>
                </div>

                {/* Card */}
                <div className="glass-card rounded-2xl shadow-xl p-8 border border-white/50 relative overflow-hidden">
                    {/* Card background decoration */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF5722]/10 rounded-full"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#FF5722]/10 rounded-full"></div>

                    {success ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiCheck className="h-8 w-8 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h1>
                            <p className="text-gray-600 mb-6">
                                We&apos;ve sent a password reset link to <span className="font-medium text-[#FF5722]">{email}</span>.
                                The link will expire in 1 hour.
                            </p>
                            <p className="text-gray-500 text-sm mb-6">
                                Didn&apos;t receive the email? Check your spam folder or try again.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="w-full py-3 px-4 rounded-xl bg-white border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Try Again
                                </button>
                                <Link
                                    href="/auth/login"
                                    className="block w-full py-3 px-4 rounded-xl bg-[#FF5722]/10 text-[#FF5722] font-medium text-center hover:bg-[#FF5722]/20 transition-colors"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
                            <p className="text-gray-500 mb-6">Enter your email and we&apos;ll send you a link to reset your password</p>

                            {error && (
                                <div className="w-full bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {/* Email field */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiMail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="neumorph-input pl-10 pr-4 py-3 w-full rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF7A50] text-white font-medium shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Reset Link'
                                        )}
                                    </button>

                                    <Link
                                        href="/auth/login"
                                        className="flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                                    >
                                        <FiArrowLeft className="h-4 w-4" />
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        </>
                    )}
                </div>

                {/* Footer links */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <div className="flex justify-center space-x-4">
                        <Link href="/terms" className="hover:text-gray-700">Terms</Link>
                        <Link href="/privacy" className="hover:text-gray-700">Privacy</Link>
                        <Link href="/help" className="hover:text-gray-700">Help</Link>
                    </div>
                    <div className="mt-2">
                        © {new Date().getFullYear()} Rovify. All rights reserved.
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
        
        .neumorph-input {
          box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.05), 
                     inset -2px -2px 5px rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }
        
        .neumorph-input:focus {
          box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.05), 
                     inset -1px -1px 2px rgba(255, 255, 255, 0.5);
        }
      `}</style>
        </div>
    );
}