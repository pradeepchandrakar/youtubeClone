import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  MdOutlineThumbUp,
  MdOutlineThumbDown,
  MdOutlineReply,
  MdOutlineAddTask,
  MdThumbUp,
  MdThumbDown
} from 'react-icons/md';
import { format } from 'timeago.js';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Comments from '../components/Comments';
import { dislike, fetchSuccess, like } from '../redux/videoSlice';
import { subscription } from '../redux/userSlice';
import Recommendation from '../components/Recommendation';

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const path = useLocation().pathname.split("/")[2];
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${path}`);
        if (videoRes.data) {
          await axios.put(`/videos/view/${path}`);
        }
        const channelRes = await axios.get(`/users/find/${videoRes.data.userId}`);
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
      } catch (err) {
        console.error('Error fetching video data:', err);
      }
    };
    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    await axios.put(`/users/like/${currentVideo._id}`);
    dispatch(like(currentUser?._id));
  };

  const handleDislike = async () => {
    await axios.put(`/users/dislike/${currentVideo._id}`);
    dispatch(dislike(currentUser?._id));
  };

  const handleSub = async () => {
    if (currentUser?.subscribedUsers.includes(channel._id)) {
      await axios.put(`/users/unsub/${channel._id}`);
    } else {
      await axios.put(`/users/sub/${channel._id}`);
    }
    dispatch(subscription(channel._id));
  };

  return (
    <div className="flex gap-2 max-[700px]:block max-[700px]:min-h-screen">
      <div className="flex-1 p-2">
        <div className="w-full max-w-4xl mx-auto">
          <video className="w-full h-auto max-h-[500px]" src={currentVideo?.videoUrl} controls />
        </div>
        <h1 className="text-xl font-medium mt-3 mb-2 text-text">{currentVideo?.title}</h1>
        <div className="flex justify-between items-center max-[700px]:flex-col max-[700px]:items-start">
          <span className="text-sm text-textSoft mb-1 max-[700px]:mb-2">
            {currentVideo?.views} views • {format(currentVideo?.createdAt)}
          </span>
          <div className="flex gap-4 text-text">
            <button onClick={handleLike} className="flex items-center gap-1 cursor-pointer">
              {currentVideo?.likes?.includes(currentUser?._id) ? <MdThumbUp /> : <MdOutlineThumbUp />} {currentVideo?.likes?.length}
            </button>
            <button onClick={handleDislike} className="flex items-center gap-1 cursor-pointer">
              {currentVideo?.dislikes?.includes(currentUser?._id) ? <MdThumbDown /> : <MdOutlineThumbDown />} Dislike
            </button>
            <button className="flex items-center gap-1 cursor-pointer">
              <MdOutlineReply /> Share
            </button>
            <button className="flex items-center gap-1 cursor-pointer">
              <MdOutlineAddTask /> Save
            </button>
          </div>
        </div>

        <hr className="my-4 border-soft" />

        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <img src={channel.img} alt="channel" className="w-12 h-12 rounded-full" />
            <div className="text-text">
              <h2 className="font-semibold">{channel.name}</h2>
              <p className="text-sm text-textSoft">{channel.subscribers} subscribers</p>
              <p className="text-sm mt-2 hidden md:block">{currentVideo?.desc}</p>
            </div>
          </div>
          {currentUser ? (
            <button onClick={handleSub} className="bg-red-600 text-white rounded-md py-2 px-4 text-sm">
              {currentUser?.subscribedUsers?.includes(channel._id) ? 'SUBSCRIBED' : 'SUBSCRIBE'}
            </button>
          ) : (
            <Link to="/signin" className="text-inherit">
              <button className="bg-red-600 text-white rounded-md py-2 px-4 text-sm">SUBSCRIBE</button>
            </Link>
          )}
        </div>

        <p className="text-sm text-text mt-4 md:hidden px-2">{currentVideo?.desc}</p>

        <hr className="my-4 border-soft" />

        <Comments videoId={currentVideo?._id} />
      </div>

      <Recommendation tags={currentVideo?.tags} />
    </div>
  );
};

export default Video;

