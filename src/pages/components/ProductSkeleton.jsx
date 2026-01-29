import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="relative bg-white rounded-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200"></div>

      {/* Text skeleton */}
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>

        {/* Size tags skeleton */}
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="h-5 w-8 bg-gray-200 rounded-md"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
