// components/RovifyLogo.tsx
import Link from 'next/link';

interface LogoProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export default function RovifyLogo({ size = 'medium', className = '' }: LogoProps) {
    // Determine sizes based on the size prop
    const dimensions = {
        small: { container: 'h-8 w-8', text: 'text-lg' },
        medium: { container: 'h-10 w-10', text: 'text-xl' },
        large: { container: 'h-12 w-12', text: 'text-2xl' },
    };

    return (
        <Link href="/" className={`flex items-center gap-2 ${className}`}>
            {/* Triangle/arrow logo from the website */}
            <div className={`${dimensions[size].container} bg-rovify-orange rounded-md flex items-center justify-center`}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                >
                    <path
                        d="M3 12L12 5L21 12L12 19L3 12Z"
                        fill="white"
                    />
                </svg>
            </div>
            <span className={`font-bold tracking-tight ${dimensions[size].text}`}>
                Rovify
            </span>
        </Link>
    );
}