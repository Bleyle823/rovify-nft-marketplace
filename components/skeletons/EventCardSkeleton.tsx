// components/skeletons/EventCardSkeleton.tsx
import { FC } from 'react';

interface EventCardSkeletonProps {
    variant?: 'default' | 'featured' | 'compact';
}

const EventCardSkeleton: FC<EventCardSkeletonProps> = ({
    variant = 'default'
}) => {
    const isFeatured = variant === 'featured';
    const isCompact = variant === 'compact';

    return (
        <div
            className={`relative rounded-xl overflow-hidden ${isFeatured ? 'h-96' : isCompact ? 'h-32' : 'h-64'
                } w-full bg-white`}
            style={{
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
        >
            {/* Image Placeholder */}
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>

            {/* Content Placeholders */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 ${isFeatured ? 'pb-6' : isCompact ? 'pb-3' : 'pb-4'
                } z-10`}>
                {/* Category & Date */}
                <div className="flex gap-2 mb-2">
                    <div className="h-5 w-20 bg-gray-300 rounded-full animate-shimmer"></div>
                    <div className="h-5 w-24 bg-gray-300 rounded-full animate-shimmer" style={{
                        animationDelay: '0.1s'
                    }}></div>
                </div>

                {/* Title */}
                <div
                    className={`h-${isFeatured ? '8' : '6'} w-full max-w-[85%] bg-gray-300 rounded-md animate-shimmer`}
                    style={{ animationDelay: '0.2s' }}
                ></div>

                {/* Location & Price - Only for default and featured */}
                {!isCompact && (
                    <div className="flex justify-between items-center mt-3">
                        <div
                            className="h-4 w-24 bg-gray-300 rounded-full animate-shimmer"
                            style={{ animationDelay: '0.3s' }}
                        ></div>
                        <div
                            className="h-6 w-16 bg-gray-300 rounded-full animate-shimmer"
                            style={{ animationDelay: '0.4s' }}
                        ></div>
                    </div>
                )}

                {/* Social Engagement - Only for featured */}
                {isFeatured && (
                    <div className="flex gap-4 mt-4">
                        <div
                            className="h-5 w-14 bg-gray-300 rounded-full animate-shimmer"
                            style={{ animationDelay: '0.5s' }}
                        ></div>
                        <div
                            className="h-5 w-14 bg-gray-300 rounded-full animate-shimmer"
                            style={{ animationDelay: '0.6s' }}
                        ></div>
                        <div
                            className="h-5 w-14 bg-gray-300 rounded-full animate-shimmer"
                            style={{ animationDelay: '0.7s' }}
                        ></div>
                    </div>
                )}
            </div>

            {/* Bottom Progress Bar - Only for featured */}
            {isFeatured && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-300 animate-pulse"></div>
            )}
        </div>
    );
};

export default EventCardSkeleton;