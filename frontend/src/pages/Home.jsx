import { useState, useEffect } from 'react';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';
import Loader from '../components/Loader';
import { HiTrendingUp, HiRefresh } from 'react-icons/hi';
import './Home.css';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchVideos();
  }, [page]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/videos?page=${page}&limit=12&sortBy=createdAt&sortType=desc`);
      setVideos(data?.videos || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error('Failed to load videos:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page home-page" id="home-page">
      <div className="home-header">
        <h1 className="page-title">
          <HiTrendingUp />
          Discover
        </h1>
        <button className="btn btn-ghost btn-sm" onClick={fetchVideos} id="refresh-btn">
          <HiRefresh size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <Loader text="Loading videos..." />
      ) : videos.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🎬</span>
          <h3>No videos yet</h3>
          <p>Be the first to upload a video!</p>
        </div>
      ) : (
        <>
          <div className="video-grid" id="video-grid">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination" id="pagination">
              <button
                className="btn btn-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
