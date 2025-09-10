// components/skeletons/TicketSkeleton.tsx
const TicketSkeleton = () => {
    return (
        <div className="relative h-32 flex rounded-xl overflow-hidden border border-gray-100">
            {/* Left: Event Image Placeholder */}
            <div className="w-1/3 relative">
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            </div>

            {/* Right: Ticket Info */}
            <div className="w-2/3 bg-white p-3 flex flex-col justify-between">
                <div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded-md animate-shimmer"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded-md mt-2 animate-shimmer" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded-md mt-2 animate-shimmer" style={{ animationDelay: '0.2s' }}></div>
                </div>

                <div className="flex justify-between items-end">
                    <div className="h-5 w-20 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '0.3s' }}></div>
                    <div className="h-5 w-16 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>

            {/* Dotted separation line */}
            <div className="absolute h-full w-0 left-1/3 flex flex-col justify-between py-2">
                <div className="h-3 w-3 rounded-full bg-gray-200"></div>
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-1 w-1 rounded-full bg-gray-200"></div>
                ))}
                <div className="h-3 w-3 rounded-full bg-gray-200"></div>
            </div>
        </div>
    );
};

export default TicketSkeleton;