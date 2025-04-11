import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import LoadingComp from "../components/LoadingComp";

const Search = () => {
  const [error, setError] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = useLocation().search;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`/videos/search${query}`);
        setVideos(res.data);
        if (res.data.length === 0) {
          setError("No videos found");
        } else {
          setError("");
        }
        setLoading(false);
      } catch (err) {
        setError("Something went wrong while fetching videos.");
        setLoading(false);
        console.log(err);
      }
    };
    fetchVideos();
  }, [query]);

  return (
    <div className="flex flex-wrap gap-3 mt-6 px-4 md:px-8">
      {loading ? (
        <LoadingComp />
      ) : error ? (
        <div className="text-center text-lg text-red-500 w-full mt-10">
          {error}
        </div>
      ) : (
        videos.map((video) => <Card key={video._id} video={video} />)
      )}
    </div>
  );
};

export default Search;
