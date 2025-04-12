import React from 'react';

const LoadingComp = () => {
  return (
    <div
      className="flex items-end justify-center py-6 bg-white dark:bg-gray-900 text-black dark:text-white"
      role="status"
      aria-label="Loading"
    >
      <span className="mr-2 text-base font-medium">Loading</span>
      <span className="flex items-end space-x-1">
        <span className="w-3 h-3 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <span className="w-3 h-3 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <span className="w-3 h-3 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </span>
    </div>
  );
};

export default LoadingComp;

