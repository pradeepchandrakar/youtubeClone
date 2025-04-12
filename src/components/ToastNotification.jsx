import React, { useEffect, useState } from "react";
import { IoClose, IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5";

const ToastNotification = ({ type = "success", message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose(); // trigger optional onClose callback
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const icon =
    type === "error" ? (
      <IoAlertCircle size={20} className="text-white mr-2" />
    ) : (
      <IoCheckmarkCircle size={20} className="text-white mr-2" />
    );

  return (
    <div
      role="alert"
      className={`
        flex items-center justify-between w-full max-w-md mx-auto mb-6 px-4 py-3 rounded shadow-md
        ${type === "error" ? "bg-red-600" : "bg-green-500"}
        text-white animate-slide-in
      `}
    >
      <div className="flex items-center flex-1">
        {icon}
        <p className="text-sm">{message}</p>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          onClose && onClose();
        }}
        className="ml-4"
        aria-label="Close notification"
      >
        <IoClose size={20} />
      </button>
    </div>
  );
};

export default ToastNotification;

