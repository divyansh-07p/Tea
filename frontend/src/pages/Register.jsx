import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMail, HiLockClosed, HiUser, HiPhotograph, HiUpload } from 'react-icons/hi';
import logo from '../assets/logo.png';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'avatar') {
        setAvatar(file);
        setAvatarPreview(reader.result);
      } else {
        setCoverImage(file);
        setCoverPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName || !form.email || !form.username || !form.password) {
      setError('All fields are required');
      return;
    }
    if (!avatar) {
      setError('Avatar is required');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('fullName', form.fullName);
    formData.append('email', form.email);
    formData.append('username', form.username);
    formData.append('password', form.password);
    formData.append('avatar', avatar);
    if (coverImage) formData.append('coverImage', coverImage);

    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="register-page">
      <div className="auth-container auth-container-wide card-glass">
        <div className="auth-header">
          <img src={logo} alt="Tea Logo" className="auth-logo-img" />
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Tea and start sharing videos</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} id="register-form">
          {/* Cover Image */}
          <div className="upload-section">
            <label className="upload-cover-area" htmlFor="cover-upload">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="cover-preview" />
              ) : (
                <div className="upload-placeholder">
                  <HiPhotograph size={32} />
                  <span>Upload Cover Image (optional)</span>
                </div>
              )}
            </label>
            <input
              type="file"
              id="cover-upload"
              accept="image/*"
              hidden
              onChange={(e) => handleFileChange(e, 'cover')}
            />

            {/* Avatar */}
            <div className="upload-avatar-wrapper">
              <label className="upload-avatar-area" htmlFor="avatar-upload">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="avatar-preview-img" />
                ) : (
                  <div className="upload-avatar-placeholder">
                    <HiUpload size={24} />
                  </div>
                )}
              </label>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                hidden
                onChange={(e) => handleFileChange(e, 'avatar')}
              />
              <span className="upload-avatar-label">Avatar *</span>
            </div>
          </div>

          <div className="auth-form-grid">
            <div className="input-group">
              <label htmlFor="reg-fullname">Full Name</label>
              <div className="input-with-icon">
                <HiUser className="input-icon" />
                <input
                  id="reg-fullname"
                  type="text"
                  className="input-field"
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="reg-username">Username</label>
              <div className="input-with-icon">
                <HiUser className="input-icon" />
                <input
                  id="reg-username"
                  type="text"
                  className="input-field"
                  placeholder="johndoe"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="reg-email">Email</label>
              <div className="input-with-icon">
                <HiMail className="input-icon" />
                <input
                  id="reg-email"
                  type="email"
                  className="input-field"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="reg-password">Password</label>
              <div className="input-with-icon">
                <HiLockClosed className="input-icon" />
                <input
                  id="reg-password"
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={loading}
            id="register-submit"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
