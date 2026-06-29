import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import CommentSection from '../components/CommentSection';
import Loader from '../components/Loader';
import { HiThumbUp, HiShare, HiBookmark, HiEye } from 'react-icons/hi';
import { timeAgo, formatViews } from '../utils/helpers';
import './VideoWatch.css';

export default function VideoWatch() {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [shareText, setShareText] = useState('Share');

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  useEffect(() => {
    if (user && videoId) {
      checkIfLiked();
      checkIfSubscribed();
    }
  }, [user, videoId, video]);

  const fetchVideo = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/videos/${videoId}`);
      setVideo(data?.data || data);
    } catch (err) {
      console.error('Failed to load video:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkIfLiked = async () => {
    try {
      const { data } = await API.get('/likes/videos');
      const likedVideos = data?.data || [];
      const isLiked = likedVideos.some(v => (v.likedVideoId || v._id) === videoId);
      setLiked(isLiked);
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfSubscribed = async () => {
    if (!user || !video?.owner?._id) return;
    try {
      const { data } = await API.get(`/subscriptions/u/${video.owner._id}`);
      const subs = data?.data || [];
      const isSub = subs.some(s => s.subscriberDetails?._id === user._id);
      setSubscribed(isSub);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    try {
      await API.post(`/likes/toggle/v/${videoId}`);
      setLiked(!liked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async () => {
    if (!video?.owner?._id) return;
    try {
      await API.post(`/subscriptions/c/${video.owner._id}`);
      setSubscribed(!subscribed);
    } catch (err) {
      console.error('Subscribe failed:', err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareText('Copied!');
    setTimeout(() => {
      setShareText('Share');
    }, 2000);
  };

  const handleSaveToggle = async () => {
    if (!user) return;
    setShowSaveModal(!showSaveModal);
    if (!showSaveModal) {
      try {
        const { data } = await API.get(`/playlist/user/${user._id}`);
        setPlaylists(data?.data || []);
      } catch (err) {
        console.error('Failed to load playlists:', err);
      }
    }
  };

  const handlePlaylistToggle = async (playlistId, isAlreadyInPlaylist) => {
    try {
      if (isAlreadyInPlaylist) {
        await API.patch(`/playlist/remove/${videoId}/${playlistId}`);
      } else {
        await API.patch(`/playlist/add/${videoId}/${playlistId}`);
      }
      // Re-fetch playlists to update checkbox state
      const { data } = await API.get(`/playlist/user/${user._id}`);
      setPlaylists(data?.data || []);
    } catch (err) {
      console.error('Failed to toggle video in playlist:', err);
    }
  };

  if (loading) return <Loader text="Loading video..." />;
  if (!video) return <div className="page"><div className="empty-state"><h3>Video not found</h3></div></div>;

  const owner = video.owner || {};

  return (
    <div className="page video-watch-page" id="video-watch-page">
      <div className="video-watch-main">
        <VideoPlayer
          src={video.videoFile}
          thumbnail={video.thumbnail}
          title={video.title}
        />

        <div className="video-watch-info">
          <h1 className="video-watch-title" id="video-title">{video.title}</h1>

          <div className="video-watch-meta-row">
            <div className="video-watch-stats">
              <span><HiEye size={16} /> {formatViews(video.views)}</span>
              <span className="meta-dot">•</span>
              <span>{timeAgo(video.createdAt)}</span>
            </div>

            <div className="video-watch-actions">
              <button
                className={`btn btn-secondary btn-sm ${liked ? 'liked' : ''}`}
                onClick={handleLike}
                id="like-btn"
              >
                <HiThumbUp size={18} />
                {liked ? 'Liked' : 'Like'}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={handleShare} id="share-btn">
                <HiShare size={18} />
                {shareText}
              </button>
              <div style={{ position: 'relative' }}>
                <button className={`btn btn-secondary btn-sm ${showSaveModal ? 'liked' : ''}`} onClick={handleSaveToggle} id="save-btn">
                  <HiBookmark size={18} />
                  Save
                </button>
                {showSaveModal && (
                  <div className="playlist-dropdown card-glass">
                    <p className="playlist-dropdown-title">Save to...</p>
                    {playlists.length === 0 ? (
                      <p className="playlist-dropdown-empty">No playlists. Go to library to create one.</p>
                    ) : (
                      <div className="playlist-dropdown-list">
                        {playlists.map((pl) => {
                          const isAlreadyInPlaylist = pl.videos?.some((v) => (v._id || v) === videoId);
                          return (
                            <label key={pl._id} className="playlist-dropdown-item">
                              <input
                                type="checkbox"
                                checked={isAlreadyInPlaylist}
                                onChange={() => handlePlaylistToggle(pl._id, isAlreadyInPlaylist)}
                              />
                              <span>{pl.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="video-watch-channel-bar card">
            <div className="video-watch-channel-info">
              <Link to={`/channel/${owner.username}`}>
                <img
                  src={owner.avatar || `https://ui-avatars.com/api/?name=${owner.fullName || 'U'}&background=1a1a1a&color=00d4aa`}
                  alt={owner.fullName}
                  className="avatar avatar-lg"
                />
              </Link>
              <div>
                <Link to={`/channel/${owner.username}`} className="channel-name">
                  {owner.fullName || owner.username || 'Unknown'}
                </Link>
                <p className="channel-username">@{owner.username}</p>
              </div>
            </div>

            {user && owner._id !== user._id && (
              <button
                className={`btn ${subscribed ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                onClick={handleSubscribe}
                id="subscribe-btn"
              >
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>

          <div className="video-watch-description card">
            <p className={showFullDesc ? '' : 'description-collapsed'}>
              {video.description || 'No description provided.'}
            </p>
            {video.description && video.description.length > 200 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowFullDesc(!showFullDesc)}
              >
                {showFullDesc ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </div>

        <CommentSection videoId={videoId} />
      </div>
    </div>
  );
}
