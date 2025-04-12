import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "./Card";

const Recommendation = ({ tags }) => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (tags?.length) {
          const query = tags.join(',');
          const res = await axios.get(`/videos/tags?tags=${encodeURIComponent(query)}`);
          setVideos(res.data);
        }
      } catch (err) {
        console.error("Error fetching recommended videos:", err);
        setError("Failed to load recommendations.");
      }
    };
    fetchVideos();
  }, [tags]);

  return (
    <div className="flex-2 sm:block sm:mt-8">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {videos.map((video) => (
        <Card type="sm" key={video._id} video={video} />
      ))}
    </div>
  );
};

export default Recommendation;

