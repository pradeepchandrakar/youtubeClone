import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import axios from 'axios';
import LoadingComp from '../components/LoadingComp';
import Tags from '../components/Tags';
import { fetchAllSuccess } from '../redux/videosSlice';
import { useDispatch, useSelector } from 'react-redux';

const Home = ({ type }) => {
  const dispatch = useDispatch();
  const { allVideos } = useSelector(state => state.videos);

  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [videoRes, tagRes] = await Promise.all([
          axios.get(`/videos/${type}`),
          axios.get('/videos/tags/all')
        ]);

        if (isMounted) {
          const videoData = Array.isArray(videoRes.data) ? videoRes.data : [];
          const tagData = Array.isArray(tagRes.data) ? tagRes.data : [];

          dispatch(fetchAllSuccess(videoData));
          setTags(tagData);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError('⚠️ Failed to load videos. Please refresh the page.');
          console.error('Home fetch error:', err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup
    };
  }, [type, dispatch]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Tag Filter Bar */}
      <div className="flex flex-wrap overflow-x-auto gap-2 py-2 text-sm text-gray-800 dark:text-white scrollbar-hide">
        <Tags tags={tags} />
      </div>

      {/* Video List or Feedback */}
      <div className="flex flex-wrap justify-between md:justify-center gap-4">
        {loading ? (
          <LoadingComp />
        ) : error ? (
          <div className="text-center w-full min-h-[60vh] text-red-500 font-medium">
            {error}
          </div>
        ) : allVideos && allVideos.length > 0 ? (
          allVideos.map(video => <Card key={video._id} video={video} />)
        ) : (
          <div className="text-center w-full min-h-[60vh] text-gray-500">
            No videos found
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;


