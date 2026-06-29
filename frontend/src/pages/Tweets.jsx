import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { HiChat, HiTrash, HiPencil } from 'react-icons/hi';
import { timeAgo } from '../utils/helpers';
import './Tweets.css';

export default function Tweets() {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTweet, setNewTweet] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (user?._id) fetchTweets();
  }, [user]);

  const fetchTweets = async () => {
    try {
      const { data } = await API.get(`/tweets/user/${user._id}`);
      setTweets(data?.data || []);
    } catch (err) {
      console.error('Failed to load tweets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTweet.trim()) return;
    try {
      await API.post('/tweets', { content: newTweet });
      setNewTweet('');
      fetchTweets();
    } catch (err) {
      console.error('Create tweet failed:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tweets/${id}`);
      setTweets(tweets.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleUpdate = async (id) => {
    if (!editContent.trim()) return;
    try {
      await API.patch(`/tweets/${id}`, { content: editContent });
      setEditingId(null);
      setEditContent('');
      fetchTweets();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (loading) return <Loader text="Loading community posts..." />;

  return (
    <div className="page" id="tweets-page">
      <h1 className="page-title"><HiChat /> Community</h1>

      <form className="tweet-create-form card" onSubmit={handleCreate} id="tweet-create-form">
        <img src={user?.avatar} alt="" className="avatar" />
        <div className="tweet-create-input-group">
          <textarea
            className="input-field"
            placeholder="What's on your mind?"
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            rows={2}
            id="tweet-input"
          />
          {newTweet.trim() && (
            <button type="submit" className="btn btn-primary btn-sm" id="tweet-submit">Post</button>
          )}
        </div>
      </form>

      <div className="tweets-list">
        {tweets.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">💬</span>
            <h3>No community posts yet</h3>
            <p>Share your thoughts with your subscribers</p>
          </div>
        ) : (
          tweets.map((tweet) => (
            <div key={tweet._id} className="tweet-item card" id={`tweet-${tweet._id}`}>
              <div className="tweet-item-header">
                <img src={user?.avatar} alt="" className="avatar avatar-sm" />
                <span className="tweet-item-author">@{user?.username}</span>
                <span className="tweet-item-time">{timeAgo(tweet.createdAt)}</span>
              </div>

              {editingId === tweet._id ? (
                <div className="tweet-edit-form">
                  <textarea className="input-field" value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={2} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(tweet._id)}>Save</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="tweet-item-content">{tweet.content}</p>
              )}

              <div className="tweet-item-actions">
                <button className="comment-action-btn" onClick={() => { setEditingId(tweet._id); setEditContent(tweet.content); }}>
                  <HiPencil size={14} /> Edit
                </button>
                <button className="comment-action-btn comment-delete-btn" onClick={() => handleDelete(tweet._id)}>
                  <HiTrash size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
