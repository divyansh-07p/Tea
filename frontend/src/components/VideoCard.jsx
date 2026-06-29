import { Link } from 'react-router-dom';
import { timeAgo, formatViews, formatDuration } from '../utils/helpers';
import './VideoCard.css';

export default function VideoCard({ video }) {
  const owner = video.owner || {};
  const ownerName = owner.fullName || owner.username || 'Unknown';
  const ownerUsername = owner.username || '';

  return (
    <div className="video-card card" id={`video-card-${video._id}`}>
      <Link to={`/watch/${video._id}`} className="video-card-thumbnail-link">
        <div className="video-card-thumbnail">
          <img src={video.thumbnail} alt={video.title} loading="lazy" />
          <span className="video-card-duration">{formatDuration(video.duration)}</span>
          <div className="video-card-overlay">
            <span>▶ Play</span>
          </div>
        </div>
      </Link>

      <div className="video-card-info">
        {ownerUsername && (
          <Link to={`/channel/${ownerUsername}`}>
            <img
              src={owner.avatar || `https://ui-avatars.com/api/?name=${ownerName}&background=0f0f0f&color=00d4aa`}
              alt={ownerName}
              className="avatar avatar-sm"
            />
          </Link>
        )}
        <div className="video-card-details">
          <Link to={`/watch/${video._id}`} className="video-card-title" title={video.title}>
            {video.title}
          </Link>
          {ownerUsername && (
            <Link to={`/channel/${ownerUsername}`} className="video-card-channel">
              {ownerName}
            </Link>
          )}
          <div className="video-card-meta">
            <span>{formatViews(video.views)}</span>
            <span className="meta-dot">•</span>
            <span>{timeAgo(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
