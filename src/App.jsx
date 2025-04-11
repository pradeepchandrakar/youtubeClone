import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import Menu from './components/Menu';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Video from './pages/Video';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Search from './pages/Search';
import Account from './pages/Account';
import Connect from './pages/Connect';
import EmailVerify from './components/EmailVerify';
import PageNotFound from './pages/PageNotFound';

import { darkTheme, lightTheme } from './utils/theme';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <div className={`flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} h-screen overflow-hidden`}>
        <BrowserRouter>
          {/* Sidebar */}
          <div className="hidden md:block w-56 h-screen sticky top-0 overflow-y-auto">
            <Menu darkMode={darkMode} setDarkMode={setDarkMode} type="lg" />
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* Fixed Navbar */}
            <div className="fixed top-0 left-0 md:left-56 right-0 z-50">
              <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>

            {/* Scrollable content area that starts below navbar */}
            <div className="mt-14 px-4 overflow-y-auto h-full">
              <Routes>
                <Route path="/" element={<Home type="random" />} />
                <Route path="/trending" element={<Home type="trend" />} />
                <Route path="/subscriptions" element={<Home type="sub" />} />
                <Route path="/search" element={<Search />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/connect" element={<Connect />} />
                <Route path="/auth/:id/verify/:token" element={<EmailVerify />} />
                <Route path="/account" element={currentUser ? <Account currentUser={currentUser} /> : <SignIn />} />
                <Route path="/video/:id" element={<Video />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;





