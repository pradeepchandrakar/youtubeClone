import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import axios from 'axios';
import LoadingComp from '../components/LoadingComp';
import Tags from '../components/Tags';
import { fetchAllSuccess } from '../redux/videosSlice';
import { useDispatch, useSelector } from 'react-redux';

const Home = ({ type }) => {
  const { allVideos } = useSelector(state => state.videos);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [videoRes, tagRes] = await Promise.all([
          axios.get(`/videos/${type}`),
          axios.get(`/videos/tags/all`),
        ]);

        // Safe check
        const videoData = Array.isArray(videoRes.data) ? videoRes.data : [];
        dispatch(fetchAllSuccess(videoData));

        setTags(tagRes.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load videos. Please refresh.');
        console.error(err);
        setLoading(false);
      }
    };

    setLoading(true);
    fetchAll();
  }, [type, dispatch]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap overflow-x-auto gap-2 py-2 text-sm text-gray-800 dark:text-white">
        <Tags tags={tags} />
      </div>

      <div className="flex flex-wrap justify-between md:justify-center gap-4">
        {loading ? (
          <LoadingComp />
        ) : error ? (
          <div className="text-center w-full min-h-[60vh] text-red-500">{error}</div>
        ) : allVideos?.length ? (
          allVideos.map((video) => <Card key={video._id} video={video} />)
        ) : (
          <div className="text-center w-full min-h-[60vh] text-gray-500">No videos found</div>
        )}
      </div>
    </div>
  );
};

export default Home;

