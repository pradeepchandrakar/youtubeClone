import React, { useState } from 'react';
import { IoLogoWhatsapp } from 'react-icons/io5';
import ToastNotification from '../components/ToastNotification';

const Connect = () => {
  const CHARACTER_LIMIT = 100;
  const URL = "https://web.whatsapp.com/send";
  const [nameEmptyError, setNameEmptyError] = useState(false);
  const [messageEmptyError, setMessageEmptyError] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    message: "",
  });

  const { userName, message } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = userName.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setNameEmptyError(true);
      setTimeout(() => setNameEmptyError(false), 3000);
      return;
    }

    if (!trimmedMessage) {
      setMessageEmptyError(true);
      setTimeout(() => setMessageEmptyError(false), 3000);
      return;
    }

    const number = 8769506494;
    const url = `${URL}?phone=${number}&text=${encodeURIComponent(`${trimmedMessage} \nMessage From ${trimmedName}`)}&app_absent=0`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-black dark:text-white">
      <div className="flex flex-col gap-4 items-center w-full max-w-md border rounded-xl p-6 bg-white dark:bg-zinc-900 dark:border-zinc-700 shadow-md">

        <IoLogoWhatsapp size={40} color="#7ed957" />
        <h1 className="text-xl font-semibold">Send Message</h1>

        {nameEmptyError && (
          <ToastNotification type="error" message="Name cannot be empty!" />
        )}
        {messageEmptyError && (
          <ToastNotification type="error" message="Message cannot be empty!" />
        )}

        <input
          type="text"
          name="userName"
          value={userName}
          onChange={handleChange}
          placeholder="Your Name"
          className={`w-full px-3 py-2 rounded border bg-transparent focus:outline-green-400 ${
            nameEmptyError ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
          }`}
        />

        <textarea
          name="message"
          value={message}
          onChange={handleChange}
          placeholder="Hi! I am interested in your product. Please contact me."
          rows={5}
          maxLength={CHARACTER_LIMIT}
          className={`w-full px-3 py-2 rounded border bg-transparent focus:outline-green-400 ${
            (message.length >= CHARACTER_LIMIT || messageEmptyError)
              ? 'border-red-500'
              : 'border-zinc-300 dark:border-zinc-700'
          }`}
        />

        <div className="text-sm self-end text-zinc-500 dark:text-zinc-400">
          {message.length}/{CHARACTER_LIMIT}
        </div>

        <button
          onClick={handleSubmit}
          disabled={message.length >= CHARACTER_LIMIT}
          className={`w-full px-6 py-2 rounded font-medium text-white transition ${
            message.length >= CHARACTER_LIMIT
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Connect;

