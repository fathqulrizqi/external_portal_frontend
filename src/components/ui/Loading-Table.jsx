import React from 'react';

const EmptyState = ({ 
  title = "No data available", 
  description = "Try adjusting the filters or check back later.",
  icon
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center w-full">
      {icon ? (
        <div className="mx-auto mb-4">{icon}</div>
      ) : (
        <svg 
          className="w-16 h-16 text-gray-400 mx-auto mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v7m3-2h6" 
          />
        </svg>
      )}

      {/* Text Section */}
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 max-w-xs mx-auto">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;