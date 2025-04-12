import React, { useState } from 'react';
import {
  IoLogoYoutube, IoLogoGithub, IoHomeSharp, IoCompassOutline
} from "react-icons/io5";
import {
  MdOutlineSubscriptions, MdOutlineCode, MdOutlineLibraryMusic, MdOutlineSportsBasketball,
  MdOutlineSportsEsports, MdOutlineMovie, MdOutlineArticle, MdOutlineLiveTv,
  MdOutlineSettings, MdOutlineBugReport, MdOutlineHelpOutline, MdOutlineSettingsBrightness,
  MdOutlineAccountCircle, MdOutlineLogout, MdOutlineAllInbox
} from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';
import axios from 'axios';
import { fetchAllFailure, fetchAllSuccess } from '../redux/videosSlice';

const Menu = ({ darkMode, setDarkMode, setOpenMenu, type }) => {
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeElement, setActiveElement] = useState('All');

  const logOut = async () => {
    try {
      const res = await axios.post('/api/auth/signout');
      if (res.status === 200) {
        localStorage.removeItem('persist:root');
        dispatch(logout());
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (tag) => {
    setActiveElement(tag);
    if (tag === 'All') {
      const res = await axios.get(`/api/videos/random`);
      dispatch(fetchAllSuccess(res.data));
    } else {
      try {
        const res = await axios.get(`/api/videos/tags?tags=${tag}`);
        if (res.data.length > 0) {
          dispatch(fetchAllSuccess(res.data));
        } else {
          dispatch(fetchAllFailure("No videos found"));
          alert("No videos found");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const menuItems = [
    { name: 'All', icon: <MdOutlineAllInbox size={18} /> },
    { name: 'Music', icon: <MdOutlineLibraryMusic size={18} /> },
    { name: 'Sports', icon: <MdOutlineSportsBasketball size={18} /> },
    { name: 'Gaming', icon: <MdOutlineSportsEsports size={18} /> },
    { name: 'Movies', icon: <MdOutlineMovie size={18} /> },
    { name: 'News', icon: <MdOutlineArticle size={18} /> },
    { name: 'Live', icon: <MdOutlineLiveTv size={18} /> },
  ];

  return (
    <div className={`fixed top-14 left-0 h-[calc(100vh-56px)] w-56 bg-white dark:bg-gray-900 text-black dark:text-white z-40 ${type === 'sm' ? 'w-2/3' : 'hidden md:block'}`}>
      <div className="h-full overflow-y-auto px-6 py-6">
        {/* Close button for mobile */}
        {type === 'sm' && (
          <div className="absolute top-3 right-3 block md:hidden cursor-pointer" onClick={() => setOpenMenu(false)}>X</div>
        )}

        {/* Logo */}
        <Link to="/" className="hidden md:flex items-center gap-2 font-bold mb-6">
          <IoLogoYoutube size={24} color="#ff0000" />
          <span>YouTube</span>
        </Link>

        {/* Main Links */}
        <Link to="/" className="flex items-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <IoHomeSharp size={18} />
          Home
        </Link>
        <Link to="/trending" className="flex items-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <IoCompassOutline size={18} />
          Explore
        </Link>
        <Link to="/subscriptions" className="flex items-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <MdOutlineSubscriptions size={18} />
          Subscriptions
        </Link>

        <hr className="my-4 border-gray-300 dark:border-gray-700" />

        <a href="https://luminous-ganache-80abf4.netlify.app/" target="_blank" rel="noreferrer" className="flex items-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <MdOutlineCode size={18} />
          Hi Developer
        </a>
        <a href="https://github.com/pradeepchandrakar" target="_blank" rel="noreferrer" className="flex items-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <IoLogoGithub size={18} />
          My GitHub
        </a>

        {!currentUser && (
          <>
            <hr className="my-4 border-gray-300 dark:border-gray-700" />
            <p className="text-sm">Sign in to like videos, comment, and subscribe.</p>
            <Link to="/signin" className="inline-flex items-center gap-2 border mt-2 px-4 py-2 text-sm rounded border-blue-500 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800">
              <MdOutlineAccountCircle size={18} />
              Sign In
            </Link>
          </>
        )}

        <hr className="my-4 border-gray-300 dark:border-gray-700" />
        <h2 className="text-sm font-semibold mb-3">More from YouTube</h2>

        {menuItems.map((tag, i) => (
          <div key={i} onClick={() => handleClick(tag.name)} className={`flex items-center gap-2 py-2 px-2 rounded cursor-pointer ${activeElement === tag.name ? 'bg-gray-200 dark:bg-gray-700 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            {tag.icon}
            {tag.name}
          </div>
        ))}

        <hr className="my-4 border-gray-300 dark:border-gray-700" />

        <Link to="/account" className="flex items-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <MdOutlineSettings size={18} />
          Settings
        </Link>
        <Link to="/connect" className="flex items-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <MdOutlineBugReport size={18} />
          Report a Bug
        </Link>
        <div className="flex items-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
          <MdOutlineHelpOutline size={18} />
          Help
        </div>

        <div className="flex items-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer" onClick={() => setDarkMode(!darkMode)}>
          <MdOutlineSettingsBrightness size={18} />
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </div>

        {currentUser && (
          <>
            <hr className="my-4 border-gray-300 dark:border-gray-700" />
            <div className="flex items-center gap-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer" onClick={logOut}>
              <MdOutlineLogout size={18} />
              Sign Out
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;




