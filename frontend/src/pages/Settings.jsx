import { useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { HiCog, HiCheck } from 'react-icons/hi';
import './Settings.css';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ fullName: user?.fullName || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { data } = await API.patch('/users/update-profile', form);
      updateUser(data?.data);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!passwords.oldPassword || !passwords.newPassword) return setError('Both passwords are required');
    setLoading(true);
    try {
      await API.post('/users/change-password', passwords);
      setMessage('Password changed successfully!');
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    try {
      const { data } = await API.patch('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data?.data);
      setMessage('Avatar updated!');
      setAvatarFile(null);
    } catch (err) {
      setError('Avatar upload failed');
    }
  };

  const handleCoverUpload = async () => {
    if (!coverFile) return;
    const formData = new FormData();
    formData.append('coverImage', coverFile);
    try {
      const { data } = await API.patch('/users/cover-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data?.data);
      setMessage('Cover image updated!');
      setCoverFile(null);
    } catch (err) {
      setError('Cover image upload failed');
    }
  };

  return (
    <div className="page settings-page" id="settings-page">
      <h1 className="page-title"><HiCog /> Settings</h1>

      {message && <p className="success-message settings-message"><HiCheck /> {message}</p>}
      {error && <p className="error-message settings-message">{error}</p>}

      {/* Profile Details */}
      <div className="settings-section card">
        <h2 className="settings-section-title">Profile Details</h2>
        <form onSubmit={handleUpdateProfile} className="settings-form" id="profile-form">
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" className="input-field" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Avatar */}
      <div className="settings-section card">
        <h2 className="settings-section-title">Avatar</h2>
        <div className="settings-avatar-row">
          <img src={user?.avatar} alt="" className="avatar avatar-xl" />
          <div>
            <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} id="avatar-file" />
            {avatarFile && <button className="btn btn-primary btn-sm" onClick={handleAvatarUpload}>Upload Avatar</button>}
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="settings-section card">
        <h2 className="settings-section-title">Cover Image</h2>
        <div className="settings-cover-preview">
          {user?.coverImage && <img src={user.coverImage} alt="Cover" />}
        </div>
        <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} id="cover-file" />
        {coverFile && <button className="btn btn-primary btn-sm" onClick={handleCoverUpload} style={{ marginTop: 8 }}>Upload Cover</button>}
      </div>

      {/* Change Password */}
      <div className="settings-section card">
        <h2 className="settings-section-title">Change Password</h2>
        <form onSubmit={handleChangePassword} className="settings-form" id="password-form">
          <div className="input-group">
            <label>Current Password</label>
            <input type="password" className="input-field" value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} />
          </div>
          <div className="input-group">
            <label>New Password</label>
            <input type="password" className="input-field" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>Change Password</button>
        </form>
      </div>
    </div>
  );
}
