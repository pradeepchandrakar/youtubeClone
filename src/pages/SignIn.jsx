import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../redux/userSlice';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import ToastNotification from '../components/ToastNotification';

const SignIn = () => {
  const [UnameOrEmail, setUnameOrEmail] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector(state => state.user);

  useEffect(() => {
    if (error === '') {
      dispatch(loginFailure(''));
    }

    function isValidEmail(email) {
      return /\S+@\S+\.\S+/.test(email);
    }

    if (isValidEmail(UnameOrEmail)) {
      setEmail(UnameOrEmail);
      setUsername('');
    } else {
      setUsername(UnameOrEmail);
      setEmail('');
    }
  }, [error, dispatch, UnameOrEmail]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = username
        ? await axios.post(`/auth/signin`, { username, password })
        : await axios.post(`/auth/signin`, { email, password });

      if (response.status === 200) {
        dispatch(loginSuccess(response.data));
        dispatch(loginFailure(null));
        navigate('/');
      }
    } catch (error) {
      dispatch(loginFailure(error?.response?.data?.message || 'Login failed.'));
    }
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        const username =
          result.user.displayName.split(' ').join('').toLowerCase() +
          Math.floor(Math.random() * 90 + 10);
        axios
          .post(`/auth/google`, {
            name: result.user.displayName,
            username: username,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            dispatch(loginSuccess(res.data));
            navigate('/');
          });
      })
      .catch((error) => {
        dispatch(loginFailure(error?.message || 'Google Sign-In failed.'));
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)] text-white mt-10 px-4">
      {/* Toast Notification */}
      {error && <ToastNotification type="error" message={error} />}

      {/* Login Card */}
      <div className="flex flex-col items-center bg-neutral-800 border border-neutral-600 px-10 py-8 gap-6 rounded-lg shadow-lg w-full max-w-md relative">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-sm text-neutral-400 hover:text-white transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-semibold mt-2">Sign In</h1>
        <h2 className="text-xl text-neutral-400">to continue to YouTube</h2>

        {/* Username or Email Input */}
        <input
          type="text"
          placeholder="Username or Email"
          onChange={(e) => {
            setUnameOrEmail(e.target.value);
            dispatch(loginFailure(''));
          }}
          className="w-full px-4 py-2 border border-neutral-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
            dispatch(loginFailure(''));
          }}
          className="w-full px-4 py-2 border border-neutral-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Sign In Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-md transition"
        >
          Sign In
        </button>

        <h2 className="text-neutral-400">OR</h2>

        {/* Google Sign In */}
        <button
          onClick={signInWithGoogle}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
        >
          Sign In with Google
        </button>

        {/* Create Account */}
        <h2 className="text-neutral-400">OR</h2>
        <Link to="/signup" className="text-blue-400 hover:underline">
          Create an account
        </Link>
      </div>

      {/* Footer Links */}
      <div className="flex text-sm text-neutral-500 mt-4">
        English (USA)
        <div className="ml-6 space-x-6">
          <span>Help</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

