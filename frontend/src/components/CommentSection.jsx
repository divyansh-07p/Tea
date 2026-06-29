import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../utils/helpers';
import { HiPencil, HiTrash, HiThumbUp } from 'react-icons/hi';
import './CommentSection.css';

export default function CommentSection({ videoId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      const { data } = await API.get(`/comments/${videoId}`);
      const commentsData = data?.data?.comments || data?.data || [];
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await API.post(`/comments/${videoId}`, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await API.delete(`/comments/c/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const handleUpdate = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      await API.patch(`/comments/c/${commentId}`, { content: editContent });
      setEditingId(null);
      setEditContent('');
      fetchComments();
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await API.post(`/likes/toggle/c/${commentId}`);
    } catch (err) {
      // toggle may fail if already liked
    }
  };

  return (
    <div className="comment-section" id="comment-section">
      <h3 className="comment-section-title">
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </h3>

      {user && (
        <form className="comment-form" onSubmit={handleAddComment} id="comment-form">
          <img src={user.avatar} alt={user.fullName} className="avatar" />
          <div className="comment-form-input-group">
            <input
              type="text"
              className="input-field comment-input"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              id="comment-input"
            />
            {newComment.trim() && (
              <div className="comment-form-actions">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setNewComment('')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" id="comment-submit">
                  Comment
                </button>
              </div>
            )}
          </div>
        </form>
      )}

      <div className="comments-list">
        {loading ? (
          <div className="skeleton" style={{ height: 60, marginBottom: 12 }} />
        ) : comments.length === 0 ? (
          <p className="comment-empty">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div className="comment-item" key={comment._id} id={`comment-${comment._id}`}>
              <img
                src={comment.user?.avatar || `https://ui-avatars.com/api/?name=${comment.user?.username || 'U'}&background=1a1a1a&color=00d4aa`}
                alt=""
                className="avatar avatar-sm"
              />
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-author">@{comment.user?.username || 'user'}</span>
                  <span className="comment-time">{timeAgo(comment.createdAt)}</span>
                </div>

                {editingId === comment._id ? (
                  <div className="comment-edit-form">
                    <input
                      type="text"
                      className="input-field"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="comment-form-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                      <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(comment._id)}>Save</button>
                    </div>
                  </div>
                ) : (
                  <p className="comment-text">{comment.content}</p>
                )}

                <div className="comment-actions">
                  <button className="comment-action-btn" onClick={() => handleLikeComment(comment._id)}>
                    <HiThumbUp size={14} />
                  </button>
                  {user && comment.user?._id === user._id && (
                    <>
                      <button
                        className="comment-action-btn"
                        onClick={() => { setEditingId(comment._id); setEditContent(comment.content); }}
                      >
                        <HiPencil size={14} />
                      </button>
                      <button className="comment-action-btn comment-delete-btn" onClick={() => handleDelete(comment._id)}>
                        <HiTrash size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
