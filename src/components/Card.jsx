import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import axios from 'axios';
import LoadingComp from './LoadingComp';

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const isSmall = type === 'sm';

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get(`/users/find/${video.userId}`);
        setChannel(res.data);
      } catch (err) {
        setError('Channel not found');
      } finally {
        setLoading(false);
      }
    };
    fetchChannel();
  }, [video.userId]);

  const fallbackAvatar = '/default-avatar.png';

  return (
    <Link to={`/video/${video._id}`} className="no-underline text-inherit">
      {loading ? (
        <LoadingComp />
      ) : (
        <div
          className={`cursor-pointer ${isSmall ? 'flex w-full mb-3 gap-3' : 'w-[300px] mb-8'} 
            sm:w-[380px] sm:mx-auto`}
        >
          {/* Video Thumbnail */}
          <img
            src={video.imgUrl || '/default-thumbnail.jpg'}
            alt="Thumbnail"
            className={`w-full ${isSmall ? 'h-[100px]' : 'h-[170px]'} object-cover bg-gray-300 sm:h-[200px]`}
          />

          {/* Info Section */}
          <div className={`flex ${!isSmall ? 'mt-4' : ''} gap-3 flex-1`}>
            {!isSmall && (
              <img
                src={channel.img || fallbackAvatar}
                onError={(e) => (e.target.src = fallbackAvatar)}
                alt="Channel"
                className="w-9 h-9 rounded-full bg-gray-300"
              />
            )}

            <div className={`${isSmall ? 'w-full' : 'w-[360px]'} sm:px-3`}>
              <h1 className="text-lg font-medium text-black dark:text-white truncate">
                {video.title || 'Untitled'}
              </h1>
              <h2 className="text-sm text-gray-500 dark:text-gray-400 my-1">
                {channel.name || 'Unknown Channel'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {video.views} views · {format(video.createdAt)}
              </p>

              {error && (
                <p className="text-xs text-red-400 mt-1">⚠ {error}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Link>
  );
};

export default Card;


