import React from "react";

const ToastNotification = ({ type, message }) => {
  return (
    <div
      className={`
        flex w-full mb-8 
        ${type === 'error' ? 'bg-red-600' : 'bg-green-500'} 
        text-white
      `}
    >
      {/* Center content horizontally and vertically */}
      <div className="flex m-3 flex-1 text-center items-center justify-center">
        <div className="w-full px-4 sm:px-0">
          <h1 className="text-base font-medium text-white">
            {message}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;
