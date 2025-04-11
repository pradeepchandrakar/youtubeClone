import React from 'react';

const LoadingComp = () => {
  return (
    <div className="flex items-end justify-center py-6 bg-white dark:bg-gray-900 text-black dark:text-white">
      <span className="mr-2">Loading</span>
      <span className="flex items-end">
        <span className="w-3 h-3 bg-black dark:bg-white rounded-full mx-1 animate-bounce [animation-delay:0s]" />
        <span className="w-3 h-3 bg-black dark:bg-white rounded-full mx-1 animate-bounce [animation-delay:0.1s]" />
        <span className="w-3 h-3 bg-black dark:bg-white rounded-full mx-1 animate-bounce [animation-delay:0.2s]" />
      </span>
    </div>
  );
};

export default LoadingComp;
