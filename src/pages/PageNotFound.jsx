import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-gray-800 dark:text-white">
      {/* Card Wrapper */}
      <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 p-6 md:p-10 gap-6 rounded-xl shadow-md">
        
        {/* Not Found Image */}
        <img
          src="https://cdn1.iconfinder.com/data/icons/photo-stickers-words/128/word_18-1024.png"
          alt="Not Found"
          className="w-full max-w-[300px] h-[200px] object-contain"
        />

        {/* Go Home Link */}
        <Link to="/">
          <h1 className="text-xl md:text-2xl font-semibold text-green-500 hover:underline transition">
            Go to Home
          </h1>
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
