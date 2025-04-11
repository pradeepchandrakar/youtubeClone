import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from "timeago.js";
import axios from 'axios';
import LoadingComp from './LoadingComp';

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`/users/find/${video.userId}`);
        setChannel(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error loading channel data');
        setLoading(false);
      }
    };
    fetchChannel();
  }, [video.userId]);

  const isSmall = type === 'sm';

  return (
    <Link to={`/video/${video._id}`} className="no-underline text-inherit">
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <LoadingComp />
      ) : (
        <div
          className={`cursor-pointer ${isSmall ? 'flex w-full mb-3 gap-3' : 'w-[300px] mb-8'} 
            sm:w-[380px] sm:mx-auto`}
        >
          <img
            src={video.imgUrl}
            alt="Thumbnail"
            className={`w-full ${isSmall ? 'h-[100px]' : 'h-[170px]'} object-cover bg-gray-300
              sm:h-[200px]`}
          />

          <div className={`flex ${!isSmall && 'mt-4'} gap-3 flex-1`}>
            {!isSmall && (
              <img
                src={channel.img}
                alt="Channel"
                className="w-9 h-9 rounded-full bg-gray-300"
              />
            )}
            <div className={`sm:px-3 ${isSmall ? 'w-full' : 'w-[360px]'}`}>
              <h1 className="text-lg font-medium text-black dark:text-white">
                {video.title}
              </h1>
              <h2 className="text-sm text-gray-500 dark:text-gray-400 my-1">
                {channel.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {video.views} views · {format(video.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
};

export default Card;

