import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoLogoYoutube } from 'react-icons/io5';
import { loginFailure, loginSuccess } from '../redux/userSlice';
import { useDispatch } from 'react-redux';

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `/auth/${param.id}/verify/${param.token}`;
        const response = await axios.get(url);
        if (response.status === 200) {
          setValidUrl(true);
          dispatch(loginSuccess(response.data));
          dispatch(loginFailure(null));
          navigate('/');
        }
      } catch (error) {
        console.log(error);
        setValidUrl(false);
        dispatch(loginFailure(error.response.data));
        navigate('/signin');
      }
    };
    verifyEmailUrl();
  }, [param, dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 text-gray-800 dark:text-white">
      {validUrl ? (
        <div className="flex flex-col items-center gap-4">
          <IoLogoYoutube size={48} className="text-red-600" />
          <h1 className="text-2xl font-semibold">Email verified successfully</h1>
          <Link to="/signin">
            <button className="flex items-center gap-2 px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition font-medium">
              Login
            </button>
          </Link>
        </div>
      ) : (
        <h1 className="text-xl font-medium text-red-600">404 Not Found — Please Retry</h1>
      )}
    </div>
  );
};

export default EmailVerify;
