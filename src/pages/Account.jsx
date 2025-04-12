import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../firebase';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/userSlice';
import ToastNotification from '../components/ToastNotification';

const Account = ({ currentUser }) => {
  const { error } = useSelector(state => state.user);
  const [inputs, setInputs] = useState({
    name: currentUser.name,
    username: currentUser.username,
    email: currentUser.email,
    img: currentUser.img
  });

  const [img, setImg] = useState(undefined);
  const [imgPer, setImgPer] = useState(0);
  const dispatch = useDispatch();

  const uploadFile = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, 'profileImages/' + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgPer(Math.round(progress));
      },
      (error) => console.error(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs(prev => ({ ...prev, img: downloadURL }));
        });
      }
    );
  };

  useEffect(() => {
    if (img) uploadFile(img);
  }, [img]);

  const handleChange = (e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!inputs.name || !inputs.username) {
      return dispatch(updateUserFailure('Name and Username are required.'));
    }

    dispatch(updateUserStart());
    try {
      const res = await axios.put(`/users/${currentUser._id}`, { ...inputs });
      if (res.status === 200) {
        dispatch(updateUserSuccess(res.data));
      }
    } catch (error) {
      dispatch(updateUserFailure(error?.response?.data?.message || 'Failed to update user.'));
    }
  };

  return (
    <div className="flex flex-col gap-6 text-black dark:text-white p-6">
      {currentUser ? (
        <div className="flex flex-col gap-6 bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-xl p-6">
          {error && <ToastNotification message={error} type="error" />}

          <div className="flex flex-col items-center text-center gap-4">
            <h2 className="text-xl font-semibold">Customize how you appear on YouTube</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Signed in as {currentUser.email}</p>
            <img
              src={inputs.img}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-zinc-500 p-4 object-cover"
            />
            <h2 className="text-2xl font-semibold">{inputs.name}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Update your photo and personal details.</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSave}>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">Name</label>
              <input
                name="name"
                value={inputs.name}
                onChange={handleChange}
                placeholder="Name"
                className="p-2 rounded border bg-transparent dark:border-zinc-700"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">Username</label>
              <input
                name="username"
                value={inputs.username}
                onChange={handleChange}
                placeholder="Username"
                className="p-2 rounded border bg-transparent dark:border-zinc-700"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                value={inputs.email}
                disabled
                className="p-2 rounded border bg-transparent text-gray-400 dark:border-zinc-700 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium">Profile Picture</label>
              {imgPer > 0 && imgPer < 100 ? (
                <p>Uploading {imgPer}%</p>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImg(e.target.files[0])}
                  className="p-2 rounded border bg-transparent dark:border-zinc-700"
                />
              )}
            </div>

            <button
              type="submit"
              className={`self-start px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${
                imgPer > 0 && imgPer < 100 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={imgPer > 0 && imgPer < 100}
            >
              Save
            </button>
          </form>
        </div>
      ) : (
        <p className="text-center">No user found</p>
      )}
    </div>
  );
};

export default Account;

