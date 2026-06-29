import { useState, useEffect } from 'react';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';
import Loader from '../components/Loader';
import { HiThumbUp } from 'react-icons/hi';

export default function LikedVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/likes/videos')
      .then(({ data }) => setVideos(data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading liked videos..." />;

  return (
    <div className="page" id="liked-videos-page">
      <h1 className="page-title"><HiThumbUp /> Liked Videos</h1>
      {videos.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">👍</span>
          <h3>No liked videos yet</h3>
          <p>Videos you like will appear here</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((v) => (
            <VideoCard key={v.likedVideoId || v._id} video={{
              _id: v.likedVideoId || v._id,
              title: v.title,
              thumbnail: v.thumbnail,
              duration: v.duration,
              views: v.views,
              createdAt: v.createdAt,
              owner: v.owner || {},
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
