import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllSuccess } from '../redux/videosSlice';

const Tags = ({ tags }) => {
  const dispatch = useDispatch();
  const [activeElement, setActiveElement] = useState('All');

  // Ensure tags is an array
  const tagList = Array.isArray(tags) ? tags : [];

  // Tag click handler: fetch videos based on selected tag
  const handleClick = async (tag) => {
    setActiveElement(tag);
    try {
      const res = tag === 'All'
        ? await axios.get(`/videos/random`)
        : await axios.get(`/videos/tags?tags=${tag}`);

      dispatch(fetchAllSuccess(res.data));
    } catch (err) {
      console.error('Error fetching videos by tag:', err);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-1">
      {/* Always render "All" tag */}
      <span
        key="All"
        onClick={() => handleClick('All')}
        className={`
          px-4 py-2 mb-2 min-w-[4.2rem] text-center whitespace-nowrap 
          border rounded-full cursor-pointer 
          border-neutral-400 hover:bg-slate-700 hover:text-white transition-all
          ${activeElement === 'All' ? 'bg-neutral-700 text-white border-white' : ''}
        `}
      >
        All
      </span>

      {/* Render fetched tags */}
      {tagList.map((tag, index) => (
        <span
          key={index}
          onClick={() => handleClick(tag)}
          className={`
            px-4 py-2 mb-2 min-w-[4.2rem] text-center whitespace-nowrap 
            border rounded-full cursor-pointer 
            border-neutral-400 hover:bg-slate-700 hover:text-white transition-all
            ${activeElement === tag ? 'bg-neutral-700 text-white border-white' : ''}
          `}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default Tags;

