import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Event } from '@/types';
import {
    FiX, FiTwitter, FiFacebook,
    FiMail, FiCopy, FiCheck
} from 'react-icons/fi';
import { FaTelegramPlane, FaWhatsapp, FaDiscord } from 'react-icons/fa';

interface ShareModalProps {
    event: Event;
    isOpen: boolean;
    onClose: () => void;
}

export default function ShareModal({ event, isOpen, onClose }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [animateQR, setAnimateQR] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    // QR code URL dynamically (lvrgd free QR generator service)
    const eventUrl = `https://app.rovify.io/events/${event.id}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(eventUrl)}`;

    // Animation timing
    useEffect(() => {
        if (isOpen) {
            // Start QR animation after modal opens
            const timer = setTimeout(() => {
                setAnimateQR(true);
            }, 300);

            return () => clearTimeout(timer);
        } else {
            setAnimateQR(false);
        }
    }, [isOpen]);

    // Copy link to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(eventUrl);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Prepare share links
    const shareLinks = [
        {
            name: 'Twitter',
            icon: FiTwitter,
            color: '#1DA1F2',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this event: ${event.title}`)}&url=${encodeURIComponent(eventUrl)}`
        },
        {
            name: 'Facebook',
            icon: FiFacebook,
            color: '#1877F2',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`
        },
        {
            name: 'WhatsApp',
            icon: FaWhatsapp,
            color: '#25D366',
            url: `https://wa.me/?text=${encodeURIComponent(`Check out this event: ${event.title} ${eventUrl}`)}`
        },
        {
            name: 'Telegram',
            icon: FaTelegramPlane,
            color: '#0088cc',
            url: `https://t.me/share/url?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(`Check out this event: ${event.title}`)}`
        },
        {
            name: 'Email',
            icon: FiMail,
            color: '#EA4335',
            url: `mailto:?subject=${encodeURIComponent(`Check out this event: ${event.title}`)}&body=${encodeURIComponent(`I thought you might be interested in this event: ${event.title}\n\n${eventUrl}`)}`
        },
        {
            name: 'Discord',
            icon: FaDiscord,
            color: '#5865F2',
            url: `https://discord.com/app`
        }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden transform transition-all duration-300 animate-modal-in">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-[#FF5722] to-[#FF7A50] p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>

                    <h3 className="text-xl font-bold">Share This Event</h3>
                    <p className="opacity-90 mt-1 line-clamp-1">{event.title}</p>

                    {/* Decorative elements */}
                    <div className="absolute -bottom-5 -right-5 w-20 h-20 rounded-full bg-white/10 opacity-30"></div>
                    <div className="absolute -top-5 -left-5 w-16 h-16 rounded-full bg-white/10 opacity-20"></div>
                </div>

                <div className="p-6">
                    {/* Event preview card */}
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center mb-6 border border-gray-100">
                        <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0 mr-3">
                            <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 line-clamp-1">{event.title}</h4>
                            <p className="text-sm text-gray-500 line-clamp-1">{new Date(event.date).toLocaleString()}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{event.location.city}</p>
                        </div>
                    </div>

                    {/* Share options grid */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {shareLinks.map((platform) => (
                            <a
                                key={platform.name}
                                href={platform.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                style={{ color: platform.color }}
                            >
                                <platform.icon className="w-8 h-8 mb-2" />
                                <span className="text-xs text-gray-700">{platform.name}</span>
                            </a>
                        ))}
                    </div>

                    {/* Copy link */}
                    <div className="bg-gray-50 rounded-lg p-2 flex items-center mb-6 relative overflow-hidden">
                        <div className="flex-1 truncate px-2 opacity-60 text-sm">
                            {eventUrl}
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="bg-[#FF5722] text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center"
                        >
                            {copied ? (
                                <>
                                    <FiCheck className="mr-1" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <FiCopy className="mr-1" />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center">
                        <p className="text-sm text-gray-500 mb-3">Scan QR Code</p>
                        <div
                            ref={qrRef}
                            className={`relative bg-white p-3 rounded-lg shadow-md transition-transform duration-500 ${animateQR ? 'scale-100' : 'scale-50 opacity-0'
                                }`}
                        >
                            <div className="relative w-40 h-40">
                                {/* Using a custom loader pattern to avoid Next.js image configuration issues */}
                                <div className="qr-code-container">
                                    {/* Next.js Image component with unoptimized prop */}
                                    <Image
                                        src={qrCodeUrl}
                                        alt="QR Code"
                                        width={160}
                                        height={160}
                                        unoptimized
                                        className="object-contain"
                                    />

                                    {/* QR code shine effect */}
                                    <div className="absolute inset-0 overflow-hidden">
                                        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-15 animate-qr-shine"></div>
                                    </div>

                                    {/* Mini Rovify logo in center */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white p-1 rounded-md">
                                            <div className="w-6 h-6 bg-[#FF5722] rounded-md flex items-center justify-center text-white font-bold text-xs">
                                                R
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional animation styles */}
            <style jsx global>{`
                @keyframes modal-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                .animate-modal-in {
                    animation: modal-in 0.3s ease-out forwards;
                }
                
                @keyframes qr-shine {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(200%); }
                }
                
                .animate-qr-shine {
                    animation: qr-shine 2s infinite;
                }
                
                .skew-x-15 {
                    transform: skewX(15deg);
                }
                
                .qr-code-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
            `}</style>
        </div>
    );
}