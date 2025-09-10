import React, { useState, useEffect } from 'react';
import { FiCheck, FiExternalLink, FiTwitter, FiGithub, FiMessageCircle } from 'react-icons/fi';
import { SiEthereum } from 'react-icons/si';
import Image from 'next/image';

// Types
interface ENSProfileProps {
    address: string;
    ensName?: string;
    ensAvatar?: string;
    ensSocial?: {
        twitter?: string;
        github?: string;
        discord?: string;
    };
    className?: string;
    showAddress?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const fallbackAvatars = [
    'https://source.boringavatars.com/marble/120/',
    'https://source.boringavatars.com/beam/120/',
    'https://source.boringavatars.com/pixel/120/'
];

const ENSProfile: React.FC<ENSProfileProps> = ({
    address,
    ensName,
    ensAvatar,
    ensSocial,
    className = '',
    showAddress = true,
    size = 'md'
}) => {
    const [isLoading, setIsLoading] = useState(!ensName);
    const [avatarError, setAvatarError] = useState(false);
    const [fallbackAvatar, setFallbackAvatar] = useState('');

    // Format address for display
    const formatAddress = (addr: string) => {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    // Get dimensions based on size
    const getDimensions = () => {
        switch (size) {
            case 'sm':
                return {
                    container: 'w-full max-w-xs',
                    avatar: 'h-14 w-14',
                    name: 'text-lg',
                    address: 'text-xs'
                };
            case 'lg':
                return {
                    container: 'w-full max-w-md',
                    avatar: 'h-24 w-24',
                    name: 'text-2xl',
                    address: 'text-sm'
                };
            default:
                return {
                    container: 'w-full max-w-sm',
                    avatar: 'h-20 w-20',
                    name: 'text-xl',
                    address: 'text-xs'
                };
        }
    };

    const dimensions = getDimensions();

    // Generate deterministic fallback avatar URL based on address
    useEffect(() => {
        if (!ensAvatar || avatarError) {
            // Use address to determine which fallback style to use
            const addressSum = address
                .toLowerCase()
                .split('')
                .reduce((sum, char) => sum + char.charCodeAt(0), 0);

            const index = addressSum % fallbackAvatars.length;
            setFallbackAvatar(`${fallbackAvatars[index]}${address.toLowerCase()}`);
        }
    }, [address, ensAvatar, avatarError]);

    // Simulate loading effect
    useEffect(() => {
        if (!ensName) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            setIsLoading(false);
        }
    }, [ensName]);

    // Generate gradient class based on address
    const getGradientClass = () => {
        const addressValue = parseInt(address.slice(-6), 16);
        const gradients = [
            'from-blue-500 to-purple-600',
            'from-green-400 to-cyan-500',
            'from-pink-500 to-rose-500',
            'from-amber-400 to-orange-500',
            'from-indigo-500 to-purple-500',
            'from-red-500 to-pink-500',
            'from-emerald-500 to-teal-600',
            'from-fuchsia-500 to-purple-600'
        ];
        return gradients[addressValue % gradients.length];
    };

    const gradientClass = getGradientClass();

    // Show loading skeleton if still resolving
    if (isLoading) {
        return (
            <div className={`animate-pulse rounded-2xl bg-white shadow-xl p-6 ${dimensions.container} ${className}`}>
                <div className="flex items-center space-x-4">
                    <div className={`${dimensions.avatar} rounded-full bg-gray-200`}></div>
                    <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="mt-6 h-8 bg-gray-200 rounded"></div>
            </div>
        );
    }

    return (
        <div
            className={`relative overflow-hidden rounded-2xl bg-white shadow-xl p-6 ${dimensions.container} ${className}`}
        >
            {/* Decorative background elements */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 bg-gradient-to-br ${gradientClass} -mr-10 -mt-10 blur-xl`}></div>
            <div className={`absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 bg-gradient-to-tr ${gradientClass} -ml-10 -mb-10 blur-xl`}></div>

            <div className="flex items-center space-x-4 relative">
                {/* Avatar with ENS or fallback */}
                <div className={`${dimensions.avatar} rounded-full overflow-hidden bg-gradient-to-br ${gradientClass} p-0.5 shadow-lg`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
                        <Image
                            src={avatarError || !ensAvatar ? fallbackAvatar : ensAvatar}
                            alt={ensName || address}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover rounded-full"
                            onError={() => setAvatarError(true)}
                        />
                    </div>
                </div>

                {/* User identity */}
                <div className="flex-1">
                    <div className="flex items-center">
                        {ensName ? (
                            <h3 className={`font-bold ${dimensions.name} text-gray-800`}>
                                {ensName}
                                <span className="ml-1.5 inline-flex items-center">
                                    <FiCheck className="text-green-500 text-sm" />
                                </span>
                            </h3>
                        ) : (
                            <h3 className={`font-bold ${dimensions.name} text-gray-800`}>
                                {formatAddress(address)}
                            </h3>
                        )}
                    </div>

                    {/* Show address if requested */}
                    {showAddress && (
                        <div className="flex items-center mt-1">
                            <SiEthereum className="text-gray-400 mr-1" size={12} />
                            <a
                                href={`https://etherscan.io/address/${address}`}
                                target="_blank"
                                rel="noreferrer"
                                className={`${dimensions.address} text-gray-500 hover:text-[#FF5722] transition-colors flex items-center`}
                            >
                                {formatAddress(address)}
                                <FiExternalLink className="ml-1 text-gray-400" size={12} />
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Social links if available */}
            {ensSocial && (Object.values(ensSocial).some(value => value)) && (
                <div className="mt-4 flex space-x-2">
                    {ensSocial.twitter && (
                        <a
                            href={`https://twitter.com/${ensSocial.twitter}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                        >
                            <FiTwitter className="mr-1" />
                            @{ensSocial.twitter}
                        </a>
                    )}

                    {ensSocial.github && (
                        <a
                            href={`https://github.com/${ensSocial.github}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <FiGithub className="mr-1" />
                            {ensSocial.github}
                        </a>
                    )}

                    {ensSocial.discord && (
                        <a
                            href="#"
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-indigo-50 text-indigo-500 hover:bg-indigo-100 transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                navigator.clipboard.writeText(ensSocial.discord || '');
                                alert(`Discord username ${ensSocial.discord} copied to clipboard!`);
                            }}
                        >
                            <FiMessageCircle className="mr-1" />
                            Discord
                        </a>
                    )}
                </div>
            )}

            {/* Connect button or action for unresolved ENS */}
            {!ensName && (
                <button className={`mt-4 w-full rounded-xl py-2 text-sm font-medium text-white bg-gradient-to-r ${gradientClass} hover:opacity-90 transition-opacity shadow-md`}>
                    {size === 'sm' ? 'Get ENS' : 'Register an ENS name'}
                </button>
            )}
        </div>
    );
};

export default ENSProfile;