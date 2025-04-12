import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoLogoYoutube } from 'react-icons/io5';
import { loginFailure, loginSuccess } from '../redux/userSlice';
import { useDispatch } from 'react-redux';

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(null); // null = loading, true = success, false = fail
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, token } = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const res = await axios.get(`/auth/${id}/verify/${token}`);
        if (res.status === 200) {
          dispatch(loginSuccess(res.data));
          dispatch(loginFailure(null));
          setValidUrl(true);
          // Redirect after a short delay for UX
          setTimeout(() => navigate('/'), 1500);
        }
      } catch (err) {
        console.error(err);
        dispatch(loginFailure(err.response?.data || 'Verification failed'));
        setValidUrl(false);
        // Optionally navigate to signin after a delay
        setTimeout(() => navigate('/signin'), 3000);
      }
    };
    verifyEmailUrl();
  }, [id, token, dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 text-gray-800 dark:text-white">
      {validUrl === null && (
        <div className="animate-pulse text-lg">Verifying email...</div>
      )}

      {validUrl === true && (
        <div className="flex flex-col items-center gap-4">
          <IoLogoYoutube size={48} className="text-red-600" />
          <h1 className="text-2xl font-semibold">Email verified successfully</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to home...</p>
        </div>
      )}

      {validUrl === false && (
        <div className="flex flex-col items-center gap-3 text-red-600">
          <h1 className="text-xl font-medium">Verification Failed</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The link may be invalid or expired.
          </p>
          <Link to="/signin">
            <button className="px-5 py-2 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition">
              Go to Login
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmailVerify;

