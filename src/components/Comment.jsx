import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { fetchComments } from "../helper";

const Comment = ({ comment, videoId, setComments }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchComment = async () => {
      const res = await axios.get(`/users/find/${comment.userId}`);
      setChannel(res.data);
    };
    fetchComment();
  }, [comment.userId]);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`/comments/${comment._id}`);
      fetchComments(videoId, setComments);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-3 my-8 text-black dark:text-white">
      <img
        src={channel?.img}
        alt="avatar"
        className="w-[50px] h-[50px] rounded-full object-cover"
      />
      <div className="flex flex-col gap-2 flex-1">
        <span className="text-sm font-medium">
          {channel?.name}
          <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
            1 day ago
          </span>
        </span>
        <span className="text-sm text-gray-800 dark:text-gray-200">
          {comment?.desc}
        </span>
      </div>
      {currentUser && currentUser._id === comment.userId && (
        <span
          onClick={handleDelete}
          className="cursor-pointer px-2 text-red-500 hover:text-red-700 transition"
        >
          <MdOutlineDelete size={20} />
        </span>
      )}
    </div>
  );
};

export default Comment;
