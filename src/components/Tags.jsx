import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllSuccess } from '../redux/videosSlice';

const Tags = ({ tags }) => {
  const dispatch = useDispatch();
  const [activeElement, setActiveElement] = useState('All');

  const tagList = Array.isArray(tags) ? tags : [];

  const handleClick = async (tag) => {
    if (tag === activeElement) return; // Prevent unnecessary re-fetch

    setActiveElement(tag);
    try {
      const endpoint =
        tag === 'All'
          ? '/videos/random'
          : `/videos/tags?tags=${encodeURIComponent(tag)}`;
      const res = await axios.get(endpoint);
      dispatch(fetchAllSuccess(res.data));
    } catch (err) {
      console.error('Error fetching videos by tag:', err);
    }
  };

  const tagClass = (tag) =>
    `px-4 py-2 mb-2 min-w-[4.2rem] text-center whitespace-nowrap
    border rounded-full cursor-pointer transition-all
    border-neutral-400 hover:bg-slate-700 hover:text-white
    ${activeElement === tag ? 'bg-neutral-700 text-white border-white' : ''}`;

  return (
    <div className="flex flex-wrap gap-2 sm:gap-1">
      <span
        role="button"
        tabIndex={0}
        onClick={() => handleClick('All')}
        onKeyDown={(e) => e.key === 'Enter' && handleClick('All')}
        className={tagClass('All')}
      >
        All
      </span>
      {tagList.map((tag, index) => (
        <span
          role="button"
          tabIndex={0}
          key={index}
          onClick={() => handleClick(tag)}
          onKeyDown={(e) => e.key === 'Enter' && handleClick(tag)}
          className={tagClass(tag)}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default Tags;


