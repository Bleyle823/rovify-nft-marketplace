// components/skeletons/CreateEventSkeleton.tsx
const CreateEventSkeleton = () => {
    return (
        <div className="space-y-8">
            {/* Form Progress */}
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
                <div className="flex justify-between">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-4 w-24 bg-gray-200 rounded-md animate-shimmer"
                            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Form Fields */}
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
        </div>
    );
};

export default CreateEventSkeleton;