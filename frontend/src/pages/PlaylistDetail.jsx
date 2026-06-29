import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';
import Loader from '../components/Loader';
import { HiCollection } from 'react-icons/hi';

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/playlist/${playlistId}`)
      .then(({ data }) => setPlaylist(data?.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [playlistId]);

  if (loading) return <Loader text="Loading playlist..." />;
  if (!playlist) return <div className="page"><div className="empty-state"><h3>Playlist not found</h3></div></div>;

  return (
    <div className="page" id="playlist-detail-page">
      <h1 className="page-title"><HiCollection /> {playlist.name}</h1>
      {playlist.description && <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>{playlist.description}</p>}

      {(!playlist.videos || playlist.videos.length === 0) ? (
        <div className="empty-state">
          <span className="empty-state-icon">📋</span>
          <h3>This playlist is empty</h3>
        </div>
      ) : (
        <div className="video-grid">
          {playlist.videos.map((v) => {
            const vid = typeof v === 'string' ? { _id: v } : v;
            return <VideoCard key={vid._id} video={vid} />;
          })}
        </div>
      )}
    </div>
  );
}
