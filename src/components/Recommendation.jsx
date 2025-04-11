import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "./Card";

const Recommendation = ({ tags }) => {
  const [videos, setVideos] = useState([]);

  // Fetch videos from backend based on tags
  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`/videos/tags?tags=${tags}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [tags]);

  return (
    // Container with responsive styling
    <div className="flex-2 sm:block sm:mt-8">
      {/* Render list of video cards */}
      {videos.map((video) => (
        <Card type="sm" key={video._id} video={video} />
      ))}
    </div>
  );
};

export default Recommendation;
