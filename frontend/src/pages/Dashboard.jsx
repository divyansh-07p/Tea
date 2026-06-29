import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Loader from '../components/Loader';
import { HiChartBar, HiEye, HiThumbUp, HiUserGroup, HiVideoCamera, HiTrash, HiPencil } from 'react-icons/hi';
import { formatViews, timeAgo } from '../utils/helpers';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [statsRes, videosRes] = await Promise.all([
        API.get('/dashboard/stats'),
        API.get('/dashboard/videos'),
      ]);
      setStats(statsRes.data?.data);
      setVideos(videosRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    try {
      await API.delete(`/videos/${videoId}`);
      setVideos(videos.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleTogglePublish = async (videoId) => {
    try {
      await API.patch(`/videos/toggle/publish/${videoId}`);
      setVideos(videos.map((v) => v._id === videoId ? { ...v, isPublished: !v.isPublished } : v));
    } catch (err) {
      console.error('Toggle publish failed:', err);
    }
  };

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="page dashboard-page" id="dashboard-page">
      <h1 className="page-title">
        <HiChartBar />
        Channel Dashboard
      </h1>

      {/* Stats */}
      <div className="stats-grid" id="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><HiEye size={24} /></div>
          <div className="stat-value">{stats?.totalViews?.toLocaleString() || 0}</div>
          <div className="stat-label">Total Views</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><HiUserGroup size={24} /></div>
          <div className="stat-value">{stats?.totalSubscribers?.toLocaleString() || 0}</div>
          <div className="stat-label">Subscribers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><HiThumbUp size={24} /></div>
          <div className="stat-value">{stats?.totalLikes?.toLocaleString() || 0}</div>
          <div className="stat-label">Total Likes</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><HiVideoCamera size={24} /></div>
          <div className="stat-value">{stats?.totalVideos || 0}</div>
          <div className="stat-label">Total Videos</div>
        </div>
      </div>

      {/* Videos Table */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Your Videos</h2>
        {videos.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🎬</span>
            <h3>No videos uploaded yet</h3>
            <Link to="/upload" className="btn btn-primary">Upload your first video</Link>
          </div>
        ) : (
          <div className="dashboard-videos-list">
            {videos.map((video) => (
              <div key={video._id} className="dashboard-video-item card" id={`dash-video-${video._id}`}>
                <Link to={`/watch/${video._id}`} className="dashboard-video-thumb">
                  <img src={video.thumbnail} alt={video.title} />
                </Link>
                <div className="dashboard-video-info">
                  <Link to={`/watch/${video._id}`} className="dashboard-video-title">
                    {video.title}
                  </Link>
                  <div className="dashboard-video-meta">
                    <span>{formatViews(video.views)}</span>
                    <span className="meta-dot">•</span>
                    <span>{timeAgo(video.createdAt)}</span>
                    <span className="meta-dot">•</span>
                    <span className={`badge ${video.isPublished ? 'badge-success' : 'badge-error'}`}>
                      {video.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="dashboard-video-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleTogglePublish(video._id)}
                    title={video.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {video.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(video._id)} title="Delete">
                    <HiTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
