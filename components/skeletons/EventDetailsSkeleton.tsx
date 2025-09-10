const EventDetailsSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Cover Image Skeleton */}
            <div className="relative h-[30vh] md:h-[40vh] rounded-2xl overflow-hidden bg-gray-200 animate-pulse"></div>

            {/* Title & Organiser */}
            <div className="space-y-2">
                <div className="h-10 w-3/4 bg-gray-200 rounded-lg animate-shimmer"></div>
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 animate-shimmer" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-5 w-40 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>

            {/* Event Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="h-4 w-24 bg-gray-200 mb-2 rounded-md animate-shimmer" style={{ animationDelay: `${0.3 + i * 0.1}s` }}></div>
                        <div className="h-6 w-32 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: `${0.4 + i * 0.1}s` }}></div>
                        <div className="h-5 w-40 mt-1 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: `${0.5 + i * 0.1}s` }}></div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-10 w-24 bg-gray-200 rounded-md animate-shimmer"
                            style={{ animationDelay: `${0.8 + i * 0.1}s` }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-4">
                <div className="h-7 w-48 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '1.1s' }}></div>
                <div className="h-20 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '1.2s' }}></div>
                <div className="h-20 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '1.3s' }}></div>
            </div>
        </div>
    );
};

export default EventDetailsSkeleton;