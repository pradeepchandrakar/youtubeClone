import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchComments } from '../helper';
import Comment from './Comment';

const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments(videoId, setComments);
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!desc.trim()) {
      setError("Comment can't be empty");
      return;
    }

    try {
      await axios.post(`/comments`, { desc, videoId });
      setDesc('');
      setError('');
      fetchComments(videoId, setComments);
    } catch (error) {
      console.error(error);
      setError("Failed to post comment");
    }
  };

  return (
    <div className="w-full mt-6">
      <div className="flex items-center gap-3 mb-6 sm:flex-col sm:items-start">
        <img
          src={currentUser?.img || 'https://i.pravatar.cc/150?img=3'}
          onError={(e) => (e.target.src = 'https://i.pravatar.cc/150?img=3')}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />

        {currentUser ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 items-center gap-3 w-full sm:flex-col sm:items-start"
          >
            <input
              type="text"
              aria-label="Write a comment"
              placeholder="Write a comment..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="flex-1 border-b border-gray-300 dark:border-gray-600 bg-transparent outline-none text-sm p-2 w-full text-black dark:text-white"
            />
            <button
              type="submit"
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Comment
            </button>
          </form>
        ) : (
          <Link to="/signin" className="flex gap-2">
            <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">
              Comment
            </button>
          </Link>
        )}
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            videoId={videoId}
            setComments={setComments}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;

