/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useState, useRef, useEffect } from 'react';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Image from 'next/image';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

interface PasswordConfirmModalProps {
    email: string;
    onConfirmAction: (password: string) => Promise<void>;
    onCancelAction: () => void;
}

export default function PasswordConfirmModal({ email, onConfirmAction, onCancelAction }: PasswordConfirmModalProps) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 200);
        }
    }, []);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                // Don't allow closing by clicking outside while loading
                if (!isLoading) {
                    onCancelAction();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onCancelAction, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await onConfirmAction(password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid password. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
            >
                <div className="p-6 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF5722]/10 rounded-full"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#FF5722]/10 rounded-full"></div>

                    <div className="relative">
                        {/* Logo and header */}
                        <div className="flex items-center justify-center mb-6">
                            {/* <div className="h-12 w-12 bg-[#FF5722] rounded-xl flex items-center justify-center shadow-sm mr-3">
                                <Image
                                    src={RoviLogo}
                                    src="/images/contents/rovi-logo.png"
                                    alt="Rovify Logo"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                            </div> */}
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-gray-800">Security Verification</h2>
                                <p className="text-sm text-gray-500">One more step to secure your account</p>
                            </div>
                        </div>

                        {/* User email */}
                        <div className="mb-6 text-center">
                            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-3">
                                <span className="text-xl font-medium text-[#FF5722]">{email.charAt(0).toUpperCase()}</span>
                            </div>
                            <p className="text-gray-600">{email}</p>
                            <p className="text-sm text-gray-500 mt-1">Please confirm your password to continue</p>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Password form */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        ref={inputRef}
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-12 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                                        placeholder="Enter your password"
                                        disabled={isLoading}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <FiEyeOff className="h-5 w-5" />
                                            ) : (
                                                <FiEye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={onCancelAction}
                                    disabled={isLoading}
                                    className="py-2.5 px-4 rounded-xl text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex-1 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF7A50] text-white font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:ring-opacity-50 flex-1 disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <div className="flex justify-center items-center">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    ) : (
                                        "Verify"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
        </div>
    );
}