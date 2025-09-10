// components/skeletons/ProfileSkeleton.tsx
const ProfileSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 p-6">
            {/* Header with avatar and info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Avatar */}
                <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-200 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-shimmer"></div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center sm:text-left space-y-3">
                    <div className="h-7 w-48 mx-auto sm:mx-0 bg-gray-200 rounded-md animate-shimmer"></div>
                    <div className="h-5 w-32 mx-auto sm:mx-0 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-16 w-full bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '0.2s' }}></div>

                    {/* Tags/Interests */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="h-6 w-16 bg-gray-200 rounded-full animate-shimmer"
                                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                            ></div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex justify-center sm:justify-start gap-6 text-sm mt-2">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-5 w-20 bg-gray-200 rounded-md animate-shimmer"
                                style={{ animationDelay: `${0.7 + i * 0.1}s` }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2 mt-4 sm:mt-0">
                    <div className="h-9 w-28 bg-gray-200 rounded-full animate-shimmer" style={{ animationDelay: '1s' }}></div>
                    <div className="h-9 w-28 bg-gray-200 rounded-full animate-shimmer" style={{ animationDelay: '1.1s' }}></div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSkeleton;