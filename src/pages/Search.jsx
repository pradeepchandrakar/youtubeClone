import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import LoadingComp from "../components/LoadingComp";

const Search = () => {
  const { search } = useLocation();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/videos/search${search}`);
        const videoData = Array.isArray(res.data) ? res.data : [];

        setVideos(videoData);
        setError(videoData.length === 0 ? "No videos found." : "");
      } catch (err) {
        console.error("Search error:", err);
        setError("Something went wrong while fetching videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [search]);

  return (
    <div className="flex flex-wrap gap-3 mt-6 px-4 md:px-8">
      {loading ? (
        <LoadingComp />
      ) : error ? (
        <div className="text-center text-lg text-red-500 w-full mt-10">{error}</div>
      ) : (
        videos.map((video) => <Card key={video._id} video={video} />)
      )}
    </div>
  );
};

export default Search;

