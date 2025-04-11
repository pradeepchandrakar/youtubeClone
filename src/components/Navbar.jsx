import React, { useState } from 'react';
import {
  MdOutlineAccountCircle, MdOutlineArrowLeft, MdOutlineMenu,
  MdOutlineSearch, MdOutlineVideoCall
} from "react-icons/md";
import { IoLogoYoutube } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Upload from './Upload';
import Menu from './Menu';

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [q, setQ] = useState("");
  const { currentUser } = useSelector(state => state.user);

  return (
    <>
      {/* Navbar container */}
      <div className="sticky top-0 bg-bgLighter text-text h-14 z-50">
        <div className="flex items-center justify-end h-full px-6 relative sm:justify-between">
          
          {/* Logo & Menu Icon - visible only on mobile */}
          <div className="flex sm:hidden items-center gap-2 font-bold">
            <MdOutlineMenu onClick={() => setOpenMenu(true)} className="cursor-pointer" />
            <IoLogoYoutube size={24} color="#ff0000" />
            <span>Youtube</span>
          </div>

          {/* Logo - visible only on desktop */}
          <Link to="/" className="no-underline text-inherit">
            <div className="hidden sm:flex items-center gap-2 font-bold mb-6 sm:mb-0 sm:visible sm:justify-end">
              <IoLogoYoutube size={24} color="#ff0000" />
              <span>Youtube</span>
            </div>
          </Link>

          {/* Search bar */}
          <div className="absolute left-0 right-0 mx-auto flex items-center justify-between w-[50%] p-1 border border-gray-300 rounded text-text bg-transparent sm:hover:w-[90%] sm:hover:bg-bgLighter sm:relative sm:w-[90%]">
            {/* Back button (mobile only) */}
            <div className="font-bold invisible sm:visible sm:flex sm:justify-end">
              <MdOutlineArrowLeft
                size={36}
                className="cursor-pointer"
                onClick={() => window.location.reload(false)}
              />
            </div>

            {/* Search input */}
            <input
              type="text"
              placeholder="Search"
              className="w-full border-none outline-none px-2 bg-transparent text-text"
              onChange={(e) => setQ(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') navigate(`/search?q=${q}`);
              }}
            />
            <MdOutlineSearch
              size={18}
              className="cursor-pointer"
              onClick={() => navigate(`/search?q=${q}`)}
            />
          </div>

          {/* User section */}
          {currentUser ? (
            <div className="flex items-center gap-6 font-medium text-text">
              {/* Upload icon */}
              <span className="cursor-pointer">
                <MdOutlineVideoCall size={18} onClick={() => setOpen(true)} />
              </span>

              {/* Avatar - large */}
              <img
                src={currentUser.img}
                alt="avatar"
                className="w-10 h-10 rounded-full bg-gray-300 hidden sm:block"
              />

              {/* Avatar - small */}
              <img
                src={currentUser.img}
                alt="avatar"
                className="w-10 h-10 rounded-full bg-gray-300 sm:hidden"
                onClick={() => setOpenMenu(true)}
              />

              {/* User name */}
              <div className="text-sm hidden sm:block">{currentUser.name}</div>
            </div>
          ) : (
            <Link to="/signin" className="no-underline">
              {/* Sign in button */}
              <button className="px-4 py-2 border border-link text-link rounded font-medium flex items-center gap-2">
                <MdOutlineAccountCircle size={18} />SIGN IN
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {open && <Upload setOpen={setOpen} />}

      {/* Menu - always visible on desktop */}
      <div className="hidden sm:block">
        <Menu
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          type="lg"
        />
      </div>

      {/* Mobile Menu Drawer */}
      {openMenu && (
        <div className="block sm:hidden">
          <Menu
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setOpenMenu={setOpenMenu}
            type="sm"
          />
        </div>
      )}
    </>
  );
};

export default Navbar;



