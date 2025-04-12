import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupStart, signupSuccess, signupFailure } from '../redux/userSlice';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import ToastNotification from '../components/ToastNotification';

const SignUp = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector(state => state.user);

  useEffect(() => {
    if (error === '') {
      dispatch(signupFailure(''));
    }
  }, [error, dispatch]);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const signInWithGoogle = async () => {
    dispatch(signupStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        const generatedUsername =
          result.user.displayName.split(' ').join('').toLowerCase() +
          Math.floor(Math.random() * 90 + 10);

        axios.post(`/api/auth/google`, {
          name: result.user.displayName,
          username: generatedUsername,
          email: result.user.email,
          img: result.user.photoURL,
        }).then((res) => {
          dispatch(signupSuccess(res.data));
          navigate('/');
        });
      })
      .catch((error) => {
        dispatch(signupFailure(error?.response?.data?.message || 'Google Sign-In failed.'));
      });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !username || !email || !password) {
      return dispatch(signupFailure('Please fill all the fields'));
    }

    if (!isValidEmail(email)) {
      return dispatch(signupFailure('Please provide a valid email'));
    }

    const defaultImg = 'https://uploads.commoninja.com/searchengine/wordpress/adorable-avatars.png';

    try {
      const res = await axios.post(`/api/auth/signup`, {
        name,
        username,
        email,
        img: defaultImg,
        password
      });

      if (res.status === 201) {
        setMsg(res.data.message);
        // navigate('/signin'); // Uncomment to redirect after success
      }
    } catch (err) {
      dispatch(signupFailure(err?.response?.data?.message || 'Signup failed.'));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] mt-8 px-4 text-white">
      {error && <ToastNotification type="error" message={error} />}
      {msg && <ToastNotification type="success" message={msg} />}

      <div className="flex flex-col items-center w-full max-w-md gap-5 bg-neutral-800 border border-neutral-600 px-10 py-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold">Sign Up</h1>
        <h2 className="text-xl text-neutral-400 text-center">to continue your YouTube account</h2>

        <input
          className="w-full px-4 py-2 border border-neutral-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          type="text"
          placeholder="Name"
          onChange={e => {
            setName(e.target.value);
            dispatch(signupFailure(''));
          }}
        />
        <input
          className="w-full px-4 py-2 border border-neutral-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          type="text"
          placeholder="Username"
          onChange={e => {
            setUsername(e.target.value);
            dispatch(signupFailure(''));
          }}
        />
        <input
          className="w-full px-4 py-2 border border-neutral-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          type="email"
          placeholder="Email"
          onChange={e => {
            setEmail(e.target.value);
            dispatch(signupFailure(''));
          }}
        />
        <input
          className="w-full px-4 py-2 border border-neutral-600 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          type="password"
          placeholder="Password"
          onChange={e => {
            setPassword(e.target.value);
            dispatch(signupFailure(''));
          }}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-md transition"
        >
          Sign Up
        </button>

        <h2 className="text-neutral-400">OR</h2>

        <button
          onClick={signInWithGoogle}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
        >
          Sign In with Google
        </button>

        <h2 className="text-neutral-400">OR</h2>
        <Link to="/signin" className="text-blue-400 hover:underline">
          Login to an account
        </Link>
      </div>

      <div className="flex text-sm text-neutral-500 mt-6">
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

export default SignUp;

