import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { HiCollection, HiPlus } from 'react-icons/hi';
import './Playlists.css';

export default function Playlists() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    if (user?._id) fetchPlaylists();
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      const { data } = await API.get(`/playlist/user/${user._id}`);
      setPlaylists(data?.data || []);
    } catch (err) {
      console.error('Failed to load playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await API.post('/playlist', { name: newName, description: newDesc });
      setNewName('');
      setNewDesc('');
      setShowCreate(false);
      fetchPlaylists();
    } catch (err) {
      console.error('Create playlist failed:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/playlist/${id}`);
      setPlaylists(playlists.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) return <Loader text="Loading playlists..." />;

  return (
    <div className="page" id="playlists-page">
      <div className="home-header">
        <h1 className="page-title"><HiCollection /> Playlists</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(!showCreate)} id="create-playlist-btn">
          <HiPlus size={16} />
          New Playlist
        </button>
      </div>

      {showCreate && (
        <form className="playlist-create-form card" onSubmit={handleCreate} id="create-playlist-form">
          <div className="input-group">
            <label>Name</label>
            <input type="text" className="input-field" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Playlist name" />
          </div>
          <div className="input-group">
            <label>Description</label>
            <input type="text" className="input-field" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description" />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary btn-sm">Create</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </form>
      )}

      {playlists.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📋</span>
          <h3>No playlists yet</h3>
          <p>Create your first playlist to organize videos</p>
        </div>
      ) : (
        <div className="playlists-grid">
          {playlists.map((pl) => (
            <div key={pl._id} className="playlist-card card" id={`playlist-${pl._id}`}>
              <Link to={`/playlist/${pl._id}`} className="playlist-card-content">
                <div className="playlist-card-icon"><HiCollection size={32} /></div>
                <h3 className="playlist-card-name">{pl.name}</h3>
                <p className="playlist-card-count">{pl.videos?.length || 0} videos</p>
                {pl.description && <p className="playlist-card-desc">{pl.description}</p>}
              </Link>
              <button className="btn btn-danger btn-sm playlist-delete" onClick={() => handleDelete(pl._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
