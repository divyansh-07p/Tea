import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';
import Loader from '../components/Loader';
import { formatViews } from '../utils/helpers';
import './Channel.css';

export default function Channel() {
  const { username } = useParams();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [activeTab, setActiveTab] = useState('videos');
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetchChannel();
  }, [username]);

  const fetchChannel = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/users/c/${username}`);
      const ch = data?.data;
      setChannel(ch);
      setSubscribed(ch?.isSubscribed || false);

      // Fetch channel videos
      const videosRes = await API.get(`/videos?userId=${ch._id}&limit=20`);
      setVideos(videosRes.data?.videos || []);

      // Fetch tweets
      try {
        const tweetsRes = await API.get(`/tweets/user/${ch._id}`);
        setTweets(tweetsRes.data?.data || []);
      } catch { /* tweets may fail */ }
    } catch (err) {
      console.error('Failed to load channel:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!channel) return;
    try {
      await API.post(`/subscriptions/c/${channel._id}`);
      setSubscribed(!subscribed);
    } catch (err) {
      console.error('Subscribe failed:', err);
    }
  };

  if (loading) return <Loader text="Loading channel..." />;
  if (!channel) return <div className="page"><div className="empty-state"><h3>Channel not found</h3></div></div>;

  return (
    <div className="channel-page" id="channel-page">
      {/* Banner */}
      <div className="channel-banner">
        {channel.coverImage ? (
          <img src={channel.coverImage} alt="Cover" className="channel-banner-img" />
        ) : (
          <div className="channel-banner-placeholder" />
        )}
        <div className="channel-banner-overlay" />
      </div>

      {/* Profile info */}
      <div className="channel-profile page">
        <div className="channel-profile-row">
          <img src={channel.avatar} alt={channel.fullName} className="avatar avatar-2xl channel-avatar" />
          <div className="channel-profile-info">
            <h1 className="channel-display-name">{channel.fullName}</h1>
            <p className="channel-handle">@{channel.username}</p>
            <div className="channel-stats-row">
              <span>{channel.subscribersCount || 0} subscribers</span>
              <span className="meta-dot">•</span>
              <span>{videos.length} videos</span>
            </div>
          </div>
          {user && channel._id !== user._id && (
            <button
              className={`btn ${subscribed ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleSubscribe}
              id="channel-subscribe-btn"
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>
            Videos
          </button>
          <button className={`tab ${activeTab === 'community' ? 'active' : ''}`} onClick={() => setActiveTab('community')}>
            Community
          </button>
        </div>

        {activeTab === 'videos' ? (
          videos.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">🎬</span>
              <h3>No videos yet</h3>
            </div>
          ) : (
            <div className="video-grid">
              {videos.map((v) => <VideoCard key={v._id} video={v} />)}
            </div>
          )
        ) : (
          <div className="channel-tweets">
            {tweets.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">💬</span>
                <h3>No community posts yet</h3>
              </div>
            ) : (
              tweets.map((tweet) => (
                <div key={tweet._id} className="tweet-card card" id={`tweet-${tweet._id}`}>
                  <div className="tweet-card-header">
                    <img src={channel.avatar} alt="" className="avatar avatar-sm" />
                    <span className="tweet-card-author">@{channel.username}</span>
                  </div>
                  <p className="tweet-card-content">{tweet.content}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
