import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col h-[320px] animate-pulse">
            {/* Header / Menu */}
            <div className="flex justify-between items-start mb-4">
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>

            {/* Image Skeleton */}
            <div className="flex-1 flex items-center justify-center py-4">
                <div className="h-32 w-32 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Text Content */}
            <div className="mt-4 space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded"></div>

                <div className="flex justify-between items-center mt-4">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
