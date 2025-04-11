import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import app from '../firebase';
import axios from 'axios';

const Upload = ({ setOpen }) => {
  const [img, setImg] = useState(undefined);
  const [imgPer, setImgPer] = useState(0);
  const [video, setVideo] = useState(undefined);
  const [videoPer, setVideoPer] = useState(0);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);

  const navigate = useNavigate();

  // Handle form inputs
  const handleChange = (e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Split tags by comma
  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  // Firebase file upload function
  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "imgUrl" ? setImgPer(Math.round(progress)) : setVideoPer(Math.round(progress));
      },
      (error) => console.error(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs(prev => ({ ...prev, [urlType]: downloadURL }));
        });
      }
    );
  };

  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);

  useEffect(() => {
    img && uploadFile(img, "imgUrl");
  }, [img]);

  // Submit final data to backend
  const handleUpload = async (e) => {
    e.preventDefault();
    const res = await axios.post(`/videos`, { ...inputs, tags });
    setOpen(false);
    if (res.status === 200) navigate(`/video/${res.data._id}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="w-full max-w-xl h-[600px] bg-white dark:bg-zinc-900 text-black dark:text-white p-6 rounded-lg shadow-lg relative flex flex-col gap-4 overflow-y-auto">
        
        {/* Close button */}
        <button className="absolute top-3 right-3 text-xl font-bold" onClick={() => setOpen(false)}>
          ✕
        </button>

        {/* Title */}
        <h1 className="text-center text-xl font-semibold">Upload a New Video</h1>

        {/* Video input */}
        <label className="text-sm font-medium">Video</label>
        {videoPer > 0 ? (
          <p>Uploading {videoPer}%</p>
        ) : (
          <input type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])} className="p-2 border rounded bg-transparent" />
        )}

        {/* Title input */}
        <input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handleChange}
          className="p-2 border rounded bg-transparent"
        />

        {/* Description textarea */}
        <textarea
          placeholder="Description"
          rows="4"
          name="desc"
          onChange={handleChange}
          className="p-2 border rounded bg-transparent resize-none"
        />

        {/* Tags input */}
        <input
          type="text"
          placeholder="Separate the tags with commas."
          onChange={handleTags}
          className="p-2 border rounded bg-transparent"
        />

        {/* Image input */}
        <label className="text-sm font-medium">Image</label>
        {imgPer > 0 ? (
          <p>Uploading {imgPer}%</p>
        ) : (
          <input type="file" accept="image/*" onChange={e => setImg(e.target.files[0])} className="p-2 border rounded bg-transparent" />
        )}

        {/* Upload button */}
        <button onClick={handleUpload} className="mt-auto py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
          Upload
        </button>
      </div>
    </div>
  );
};

export default Upload;
