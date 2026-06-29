import { useState, useEffect } from 'react';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';
import Loader from '../components/Loader';
import { HiClock } from 'react-icons/hi';

export default function WatchHistory() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/users/watch-history')
      .then(({ data }) => setVideos(data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading watch history..." />;

  return (
    <div className="page" id="watch-history-page">
      <h1 className="page-title"><HiClock /> Watch History</h1>
      {videos.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🕐</span>
          <h3>No watch history</h3>
          <p>Videos you watch will appear here</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((v) => <VideoCard key={v._id} video={v} />)}
        </div>
      )}
    </div>
  );
}
