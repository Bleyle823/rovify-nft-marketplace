/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { getCurrentUser } from '@/mocks/data/users';
import { EventCategory, User } from '@/types';
import Header from '@/components/Header';
import BottomNavigation from '@/components/SideNavigation';
import { FiChevronLeft } from 'react-icons/fi';

// Form types
type EventFormData = {
    title: string;
    description: string;
    category: EventCategory;
    subcategory: string;
    date: string;
    time: string;
    endDate: string;
    endTime: string;
    locationName: string;
    locationAddress: string;
    locationCity: string;
    minPrice: number;
    maxPrice: number;
    currency: string;
    totalTickets: number;
    hasNftTickets: boolean;
    tags: string;
    image: string;
};

export default function CreateEventPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    // Form setup with react-hook-form
    const { register, handleSubmit, watch, formState: { errors } } = useForm<EventFormData>({
        defaultValues: {
            currency: 'USD',
            hasNftTickets: true,
            image: 'https://via.placeholder.com/600x400/77A8FF/FFFFFF?text=Event+Image'
        }
    });

    // Watch form values for validation and preview
    const watchTitle = watch('title');
    const watchCategory = watch('category');
    const watchImage = watch('image');
    const watchDate = watch('date');
    const watchHasNft = watch('hasNftTickets');

    useEffect(() => {
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            setCurrentUser(getCurrentUser());
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Update preview image when image URL changes
    useEffect(() => {
        if (watchImage) {
            setPreviewImage(watchImage);
        }
    }, [watchImage]);

    // Form submission handler
    const onSubmit = async (data: EventFormData) => {
        setIsSubmitting(true);

        // Simulate API call delay
        setTimeout(() => {
            setIsSubmitting(false);
            router.push('/success?type=event');
        }, 2000);
    };

    // Navigation functions
    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
    };

    const handlePrevStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Header />

            <main className="container mx-auto px-4 py-6 pt-24 pb-28">
                <div className="flex items-center mb-4">
                    <button
                        onClick={() => router.back()}
                        className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300 mr-4 border border-gray-100"
                    >
                        <FiChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#FF5722]">Create Event</h1>
                        <p className="text-gray-500">Share your experience with the world</p>
                    </div>
                </div>

                {/* Journey Path Step Indicator */}
                {isLoading ? (
                    <div className="mb-8">
                        <div className="flex items-center mb-2">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-shimmer" style={{ animationDelay: `${(step - 1) * 0.1}s` }}></div>
                                    {step < 3 && (
                                        <div className="w-16 h-1 bg-gray-200 animate-shimmer" style={{ animationDelay: `${(step - 1) * 0.1 + 0.05}s` }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mb-12 mt-6">
                        {/* Main Path Container */}
                        <div className="relative mx-auto px-2 py-4 max-w-3xl">

                            {/* Decorative Background Pattern (subtle hexagons) */}
                            <div className="absolute inset-0 bg-pattern opacity-5"></div>

                            {/* Main Journey Path - Curves using SVG */}
                            <div className="relative h-20 mx-auto">
                                <svg width="100%" height="100%" viewBox="0 0 800 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                                    {/* Background Track */}
                                    <path
                                        d="M0,40 C100,70 200,0 400,40 C600,80 700,10 800,40"
                                        stroke="#E5E7EB"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        className="drop-shadow-sm"
                                    />

                                    {/* Progress Track (Animated and Gradient-Filled) */}
                                    <path
                                        d="M0,40 C100,70 200,0 400,40 C600,80 700,10 800,40"
                                        stroke="url(#progressGradient)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeDasharray="800"
                                        strokeDashoffset={currentStep === 1 ? "800" : currentStep === 2 ? "400" : "0"}
                                        className="transition-all duration-1000 ease-in-out"
                                    />

                                    {/* Gradient Definition */}
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%">
                                            <stop offset="0%" stopColor="#FF5722" />
                                            <stop offset="100%" stopColor="#FF9800" />
                                        </linearGradient>
                                        <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
                                            <feGaussianBlur stdDeviation="2" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                    </defs>
                                </svg>

                                {/* Step Markers along the Path */}
                                <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center pointer-events-none">
                                    {/* Step 1: Animation varies based on current step */}
                                    <div className={`transform transition-all duration-700 ${currentStep >= 1 ? 'scale-100' : 'scale-90 opacity-70'}`}
                                        style={{ marginLeft: '2%' }}>
                                        <div className={`
                                            relative flex items-center justify-center
                                            ${currentStep === 1
                                                ? 'animate-float-slow'
                                                : currentStep > 1
                                                    ? 'animate-none'
                                                    : 'animate-none opacity-50'
                                            }
                                        `}>
                                            {/* Step Circle */}
                                            <div className={`
                                                h-12 w-12 rounded-full flex items-center justify-center z-10
                                                transition-all duration-500
                                                ${currentStep > 1
                                                    ? 'bg-gradient-to-br from-[#FF5722] to-[#FF9800] text-white scale-90'
                                                    : currentStep === 1
                                                        ? 'bg-gradient-to-br from-[#FF5722] to-[#FF9800] text-white scale-110 shadow-lg shadow-orange-300/30'
                                                        : 'bg-white text-gray-400 border-2 border-gray-200'
                                                }
                                            `}>
                                                {currentStep > 1 ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <span className="text-lg font-semibold">1</span>
                                                )}

                                                {/* Active Pulse Animation */}
                                                {currentStep === 1 && (
                                                    <div className="absolute inset-0 rounded-full border-4 border-orange-400/20 animate-ping-slow"></div>
                                                )}
                                            </div>

                                            {/* Step Label - With 3D Effect */}
                                            <div className={`
                                                absolute -bottom-8 left-1/2 transform -translate-x-1/2 min-w-max
                                                text-sm font-medium 
                                                ${currentStep >= 1 ? 'text-[#FF5722]' : 'text-gray-500'}
                                            `}>
                                                <div className="relative">
                                                    <span className={currentStep === 1 ? 'drop-shadow-sm' : ''}>Event Details</span>
                                                    {currentStep === 1 && (
                                                        <div className="h-1 w-1 rounded-full bg-[#FF5722] absolute -bottom-2 left-1/2 transform -translate-x-1/2"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 2: Middle position with higher curve */}
                                    <div className={`transform transition-all duration-700 ${currentStep >= 2 ? 'scale-100' : 'scale-90 opacity-70'}`}
                                        style={{ marginTop: '-15%' }}>
                                        <div className={`
                                            relative flex items-center justify-center
                                            ${currentStep === 2
                                                ? 'animate-float-slow'
                                                : currentStep > 2
                                                    ? 'animate-none'
                                                    : 'animate-none opacity-50'
                                            }
                                        `}>
                                            {/* Step Circle */}
                                            <div className={`
                                                h-12 w-12 rounded-full flex items-center justify-center z-10
                                                transition-all duration-500
                                                ${currentStep > 2
                                                    ? 'bg-gradient-to-br from-[#FF5722] to-[#FF9800] text-white scale-90'
                                                    : currentStep === 2
                                                        ? 'bg-gradient-to-br from-[#FF5722] to-[#FF9800] text-white scale-110 shadow-lg shadow-orange-300/30'
                                                        : 'bg-white text-gray-400 border-2 border-gray-200'
                                                }
                                            `}>
                                                {currentStep > 2 ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <span className="text-lg font-semibold">2</span>
                                                )}

                                                {/* Active Pulse Animation */}
                                                {currentStep === 2 && (
                                                    <div className="absolute inset-0 rounded-full border-4 border-orange-400/20 animate-ping-slow"></div>
                                                )}
                                            </div>

                                            {/* Step Label */}
                                            <div className={`
                                                absolute -bottom-8 left-1/2 transform -translate-x-1/2 min-w-max
                                                text-sm font-medium
                                                ${currentStep >= 2 ? 'text-[#FF5722]' : 'text-gray-500'}
                                            `}>
                                                <div className="relative">
                                                    <span className={currentStep === 2 ? 'drop-shadow-sm' : ''}>Location & Time</span>
                                                    {currentStep === 2 && (
                                                        <div className="h-1 w-1 rounded-full bg-[#FF5722] absolute -bottom-2 left-1/2 transform -translate-x-1/2"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 3: End position */}
                                    <div className={`transform transition-all duration-700 ${currentStep >= 3 ? 'scale-100' : 'scale-90 opacity-70'}`}
                                        style={{ marginRight: '2%' }}>
                                        <div className={`
                                            relative flex items-center justify-center
                                            ${currentStep === 3
                                                ? 'animate-float-slow'
                                                : 'animate-none opacity-50'
                                            }
                                        `}>
                                            {/* Step Circle */}
                                            <div className={`
                                                h-12 w-12 rounded-full flex items-center justify-center z-10
                                                transition-all duration-500
                                                ${currentStep === 3
                                                    ? 'bg-gradient-to-br from-[#FF5722] to-[#FF9800] text-white scale-110 shadow-lg shadow-orange-300/30'
                                                    : 'bg-white text-gray-400 border-2 border-gray-200'
                                                }
                                            `}>
                                                <span className="text-lg font-semibold">3</span>

                                                {/* Active Pulse Animation */}
                                                {currentStep === 3 && (
                                                    <div className="absolute inset-0 rounded-full border-4 border-orange-400/20 animate-ping-slow"></div>
                                                )}
                                            </div>

                                            {/* Step Label */}
                                            <div className={`
                                                absolute -bottom-8 left-1/2 transform -translate-x-1/2 min-w-max
                                                text-sm font-medium
                                                ${currentStep >= 3 ? 'text-[#FF5722]' : 'text-gray-500'}
                                            `}>
                                                <div className="relative">
                                                    <span className={currentStep === 3 ? 'drop-shadow-sm' : ''}>Tickets & Publish</span>
                                                    {currentStep === 3 && (
                                                        <div className="h-1 w-1 rounded-full bg-[#FF5722] absolute -bottom-2 left-1/2 transform -translate-x-1/2"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Animated Elements - Only visible on desktop */}
                                <div className="hidden md:block">
                                    {/* Traveling dot along the path */}
                                    <div
                                        className={`absolute top-0 h-3 w-3 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] shadow-lg z-20 transition-all duration-1000 ease-in-out ${currentStep > 1 ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        style={{
                                            left: `${currentStep === 1 ? 0 : currentStep === 2 ? 50 : 100}%`,
                                            top: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            filter: 'drop-shadow(0 0 4px rgba(255, 87, 34, 0.5))'
                                        }}
                                    ></div>

                                    {/* Decorative Elements - Small floating dots/particles */}
                                    <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-[#FF5722]/20 animate-float-particle-1"></div>
                                    <div className="absolute top-3/4 left-1/2 h-1.5 w-1.5 rounded-full bg-[#FF9800]/30 animate-float-particle-2"></div>
                                    <div className="absolute top-1/3 left-3/4 h-1 w-1 rounded-full bg-[#FF5722]/40 animate-float-particle-3"></div>
                                </div>
                            </div>

                            {/* Mobile-Optimized View - Shows on small screens only */}
                            <div className="md:hidden mt-10 relative">
                                <div className="flex justify-between items-center mb-1 px-2">
                                    {["Event Details", "Location & Time", "Tickets & Publish"].map((label, idx) => (
                                        <span
                                            key={idx}
                                            className={`text-xs font-medium transition-all duration-300 ${currentStep > idx + 1
                                                ? 'text-[#FF5722]'
                                                : currentStep === idx + 1
                                                    ? 'text-[#FF5722] font-semibold'
                                                    : 'text-gray-400'
                                                }`}
                                        >
                                            {idx + 1}. {idx === 0 ? label : idx === 1 ? "Location" : "Tickets"}
                                        </span>
                                    ))}
                                </div>

                                {/* Mobile Progress Bar */}
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] rounded-full transition-all duration-700 ease-in-out"
                                        style={{ width: `${(currentStep / 3) * 100}%` }}
                                    >
                                        {/* Animated Shine Effect */}
                                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                                            <div
                                                className="absolute top-0 left-[-100%] h-full w-[50%] bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 animate-shimmerMobile"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Content */}
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                    {isLoading ? (
                        // Form Loading Skeleton
                        <div className="space-y-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div
                                        className="h-5 w-32 bg-gray-200 rounded-md animate-shimmer"
                                        style={{ animationDelay: `${0.7 + i * 0.2}s` }}
                                    ></div>
                                    <div
                                        className="h-12 w-full bg-gray-200 rounded-lg animate-shimmer"
                                        style={{ animationDelay: `${0.8 + i * 0.2}s` }}
                                    ></div>
                                </div>
                            ))}

                            {/* Grid Layout for Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div
                                            className="h-5 w-32 bg-gray-200 rounded-md animate-shimmer"
                                            style={{ animationDelay: `${1.5 + i * 0.2}s` }}
                                        ></div>
                                        <div
                                            className="h-12 w-full bg-gray-200 rounded-lg animate-shimmer"
                                            style={{ animationDelay: `${1.6 + i * 0.2}s` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>

                            {/* Button Row */}
                            <div className="pt-4">
                                <div
                                    className="h-12 w-full bg-gray-200 rounded-lg animate-shimmer"
                                    style={{ animationDelay: '2s' }}
                                ></div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="animate-fadeIn">
                            {/* Step 1: Event Details */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    {/* Event Title */}
                                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                            Event Title*
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            placeholder="Give your event a catchy title"
                                            className={`w-full bg-white border ${errors.title ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                            {...register("title", { required: 'Title is required' })}
                                        />
                                        {errors.title && <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.title.message}</p>}
                                    </div>

                                    {/* Event Description */}
                                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                            Event Description*
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            placeholder="Describe what makes your event special"
                                            className={`w-full bg-white border ${errors.description ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                            {...register("description", {
                                                required: 'Description is required',
                                                minLength: { value: 20, message: 'Description should be at least 20 characters' }
                                            })}
                                        />
                                        {errors.description && <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.description.message}</p>}
                                    </div>

                                    {/* Category and Subcategory */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="transform transition-all hover:scale-[1.01] duration-300 relative">
                                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                Category*
                                            </label>
                                            <select
                                                id="category"
                                                className={`w-full bg-white border ${errors.category ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base pr-10 appearance-none`}
                                                {...register("category", { required: 'Category is required' })}
                                            >
                                                <option value="">Select a category</option>
                                                <option value="MUSIC">Music</option>
                                                <option value="CONFERENCE">Conference</option>
                                                <option value="WORKSHOP">Workshop</option>
                                                <option value="ART">Art</option>
                                                <option value="WELLNESS">Wellness</option>
                                                <option value="GAMING">Gaming</option>
                                                <option value="FILM">Film</option>
                                                <option value="AUTOMOTIVE">Automotive</option>
                                                <option value="TECHNOLOGY">Technology</option>
                                                <option value="FOOD">Food</option>
                                            </select>
                                            {/* Custom dropdown arrow */}
                                            <div className="absolute right-3.5 top-1/2 mt-2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            {errors.category && <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.category.message}</p>}
                                        </div>

                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                Subcategory
                                            </label>
                                            <input
                                                type="text"
                                                id="subcategory"
                                                placeholder="E.g., Electronic, Workshop, Exhibition"
                                                className="w-full bg-white border border-gray-300 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base"
                                                {...register("subcategory")}
                                            />
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                            Tags (comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            id="tags"
                                            placeholder="E.g., music, nightlife, art"
                                            className="w-full bg-white border border-gray-300 rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base"
                                            {...register("tags")}
                                        />
                                        <p className="text-gray-500 text-xs mt-1.5 ml-1">Help people discover your event with relevant tags</p>
                                    </div>

                                    {/* Next Step Button */}
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={!watchTitle || !watchCategory}
                                        className={`w-full py-3.5 rounded-lg font-medium transition-all duration-300 mt-6 text-base ${watchTitle && watchCategory
                                            ? 'bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white hover:shadow-lg hover:translate-y-[-2px]'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {watchTitle && watchCategory ? (
                                            <div className="flex items-center justify-center">
                                                Next: Location & Time
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        ) : (
                                            "Complete required fields"
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Location & Time */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    {/* Location Name */}
                                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                                        <label htmlFor="locationName" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                            Venue/Location Name*
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="locationName"
                                                placeholder="Where is your event happening?"
                                                className={`w-full bg-white border ${errors.locationName ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                {...register("locationName", { required: 'Venue name is required' })}
                                            />
                                        </div>
                                        {errors.locationName && <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.locationName.message}</p>}
                                    </div>

                                    {/* Address */}
                                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                                        <label htmlFor="locationAddress" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                            Address*
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2H4v-1h16v1h-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="locationAddress"
                                                placeholder="Street address"
                                                className={`w-full bg-white border ${errors.locationAddress ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                {...register("locationAddress", { required: 'Address is required' })}
                                            />
                                        </div>
                                        {errors.locationAddress && <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.locationAddress.message}</p>}
                                    </div>

                                    {/* City */}
                                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                                        <label htmlFor="locationCity" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                            City*
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="locationCity"
                                                placeholder="City where the event is located"
                                                className={`w-full bg-white border ${errors.locationCity ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                {...register("locationCity", { required: 'City is required' })}
                                            />
                                        </div>
                                        {errors.locationCity && <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.locationCity.message}</p>}
                                    </div>

                                    {/* Date and Time */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                Start Date*
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="date"
                                                    id="date"
                                                    className={`w-full bg-white border ${errors.date ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                    {...register("date", { required: 'Start date is required' })}
                                                />
                                            </div>
                                            {errors.date && <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.date.message}</p>}
                                        </div>

                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                Start Time*
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="time"
                                                    id="time"
                                                    className={`w-full bg-white border ${errors.time ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                    {...register("time", { required: 'Start time is required' })}
                                                />
                                            </div>
                                            {errors.time && <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.time.message}</p>}
                                        </div>
                                    </div>

                                    {/* End Date and Time */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                End Date*
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="date"
                                                    id="endDate"
                                                    className={`w-full bg-white border ${errors.endDate ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                    {...register("endDate", { required: 'End date is required' })}
                                                />
                                            </div>
                                            {errors.endDate && <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.endDate.message}</p>}
                                        </div>

                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                End Time*
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="time"
                                                    id="endTime"
                                                    className={`w-full bg-white border ${errors.endTime ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                    {...register("endTime", { required: 'End time is required' })}
                                                />
                                            </div>
                                            {errors.endTime && <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.endTime.message}</p>}
                                        </div>
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="flex gap-4 mt-8">
                                        <button
                                            type="button"
                                            onClick={handlePrevStep}
                                            className="flex-1 py-3.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-medium transition-all duration-300 hover:shadow text-base flex items-center justify-center hover:translate-y-[-2px]"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            disabled={!watchDate}
                                            className={`flex-1 py-3.5 rounded-lg font-medium transition-all duration-300 text-base flex items-center justify-center ${watchDate
                                                ? 'bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white hover:shadow-lg hover:translate-y-[-2px]'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {watchDate ? (
                                                <>
                                                    Next: Tickets
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </>
                                            ) : (
                                                "Complete required fields"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Tickets & Publish */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    {/* Pricing */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                Minimum Price*
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="number"
                                                    id="minPrice"
                                                    placeholder="0"
                                                    min={0}
                                                    className={`w-full bg-white border ${errors.minPrice ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                    {...register("minPrice", {
                                                        required: 'Min price is required',
                                                        min: { value: 0, message: 'Price cannot be negative' },
                                                        valueAsNumber: true
                                                    })}
                                                />
                                            </div>
                                            {errors.minPrice && <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.minPrice.message}</p>}
                                        </div>

                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                Maximum Price*
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="number"
                                                    id="maxPrice"
                                                    placeholder="100"
                                                    min={0}
                                                    className={`w-full bg-white border ${errors.maxPrice ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                    {...register("maxPrice", {
                                                        required: 'Max price is required',
                                                        min: { value: 0, message: 'Price cannot be negative' },
                                                        valueAsNumber: true
                                                    })}
                                                />
                                            </div>
                                            {errors.maxPrice && <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.maxPrice.message}</p>}
                                        </div>

                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                Currency*
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <select
                                                    id="currency"
                                                    className={`w-full bg-white border ${errors.currency ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base appearance-none pr-10`}
                                                    {...register("currency", { required: 'Currency is required' })}
                                                >
                                                    <option value="USD">USD ($)</option>
                                                    <option value="EUR">EUR (€)</option>
                                                    <option value="GBP">GBP (£)</option>
                                                    <option value="JPY">JPY (¥)</option>
                                                </select>
                                                <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.currency && <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.currency.message}</p>}
                                        </div>
                                    </div>

                                    {/* Total Tickets */}
                                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                                        <label htmlFor="totalTickets" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                            Total Available Tickets*
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="number"
                                                id="totalTickets"
                                                placeholder="100"
                                                min={1}
                                                className={`w-full bg-white border ${errors.totalTickets ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                {...register("totalTickets", {
                                                    required: 'Total tickets is required',
                                                    min: { value: 1, message: 'Must have at least 1 ticket' },
                                                    valueAsNumber: true
                                                })}
                                            />
                                        </div>
                                        {errors.totalTickets && <p className="text-red-500 text-sm mt-1.5 ml-1">{errors.totalTickets.message}</p>}
                                    </div>

                                    {/* NFT Tickets Option - Enhanced */}
                                    <div className="bg-gradient-to-r from-white to-orange-50 rounded-xl p-6 border border-orange-100 shadow-md transform transition-all hover:shadow-lg duration-300 hover:scale-[1.01]">
                                        <div className="flex items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-xl mb-2 flex items-center gap-2 text-gray-800">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] flex items-center justify-center shadow-md">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                                                        </svg>
                                                    </div>
                                                    NFT Tickets
                                                    {watchHasNft && (
                                                        <span className="text-xs bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white px-2 py-1 rounded-full ml-2 shadow-sm">Enabled</span>
                                                    )}
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    Create blockchain-based tickets that can be collected, traded, and verified on-chain.
                                                </p>
                                                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                                                    <li className="flex items-center gap-2">
                                                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] flex items-center justify-center shadow-sm">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        Collectable digital memorabilia
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] flex items-center justify-center shadow-sm">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        Resellable on secondary marketplaces
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] flex items-center justify-center shadow-sm">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        Enhanced anti-fraud protection
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] flex items-center justify-center shadow-sm">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        Creator royalties on resales
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="ml-4 flex items-center h-full">
                                                <label className="inline-flex relative items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        {...register("hasNftTickets")}
                                                    />
                                                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF5722] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#FF5722] peer-checked:to-[#FF9800] shadow-inner"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="flex gap-4 mt-8">
                                        <button
                                            type="button"
                                            onClick={handlePrevStep}
                                            className="flex-1 py-3.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-medium transition-all duration-300 hover:shadow text-base flex items-center justify-center hover:translate-y-[-2px]"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 py-3.5 bg-gradient-to-r from-[#FF5722] to-[#FF9800] hover:from-[#E64A19] hover:to-[#FB8C00] text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center hover:translate-y-[-2px]"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creating Your Event...
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Publish Event
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </main>

            {/* <BottomNavigation /> */}

            {/* Global Styles */}
            <style jsx global>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                .animate-shimmer {
                    background: linear-gradient(
                        90deg,
                        #f0f0f0 25%,
                        #e0e0e0 50%,
                        #f0f0f0 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }

                @keyframes fadeIn {
                    0% { opacity: 0; transform: scale(0.98); }
                    100% { opacity: 1; transform: scale(1); }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }

                @keyframes shimmerMobile {
                    0% { left: -50%; }
                    100% { left: 100%; }
                }
                
                .animate-shimmerMobile {
                    animation: shimmerMobile 1.5s ease-in-out infinite;
                }

                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }
                
                .animate-float-slow {
                    animation: float-slow 3s ease-in-out infinite;
                }

                @keyframes ping-slow {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    70%, 100% { transform: scale(1.8); opacity: 0; }
                }
                
                .animate-ping-slow {
                    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }

                @keyframes float-particle-1 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.6; }
                    25% { transform: translate(3px, -5px); opacity: 0.8; }
                    50% { transform: translate(8px, 2px); opacity: 0.4; }
                    75% { transform: translate(4px, 8px); opacity: 0.7; }
                }
                
                .animate-float-particle-1 {
                    animation: float-particle-1 8s ease-in-out infinite;
                }

                @keyframes float-particle-2 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.4; }
                    25% { transform: translate(-5px, 4px); opacity: 0.7; }
                    50% { transform: translate(-2px, -6px); opacity: 0.5; }
                    75% { transform: translate(3px, 5px); opacity: 0.8; }
                }
                
                .animate-float-particle-2 {
                    animation: float-particle-2 10s ease-in-out infinite;
                    animation-delay: 1s;
                }

                @keyframes float-particle-3 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.3; }
                    25% { transform: translate(4px, 6px); opacity: 0.6; }
                    50% { transform: translate(-5px, 4px); opacity: 0.4; }
                    75% { transform: translate(-7px, -4px); opacity: 0.7; }
                }
                
                .animate-float-particle-3 {
                    animation: float-particle-3 12s ease-in-out infinite;
                    animation-delay: 2s;
                }

                .bg-pattern {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                }

                /* Style fixes for date/time inputs in various browsers */
                input[type="date"], input[type="time"] {
                    appearance: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                }

                /* More consistent dropdown behavior */
                select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23718096'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E");
                    background-position: right 0.75rem center;
                    background-repeat: no-repeat;
                    background-size: 1.5em;
                }
            `}</style>
        </div>
    );
}