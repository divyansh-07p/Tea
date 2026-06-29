import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { HiUpload, HiVideoCamera, HiPhotograph } from 'react-icons/hi';
import './UploadVideo.css';

export default function UploadVideo() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', duration: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleVideoFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !videoFile || !thumbnail) {
      setError('Title, video file, and thumbnail are required');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('duration', form.duration || '0');
    formData.append('videoFile', videoFile);
    formData.append('thumbnail', thumbnail);

    try {
      await API.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded / e.total) * 100);
          setProgress(pct);
        },
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="page upload-page" id="upload-page">
      <h1 className="page-title">
        <HiUpload />
        Upload Video
      </h1>

      <form className="upload-form card" onSubmit={handleSubmit} id="upload-form">
        <div className="upload-files-row">
          {/* Video File */}
          <label className="upload-drop-zone" htmlFor="video-file-input" id="video-drop-zone">
            {videoPreview ? (
              <video src={videoPreview} className="upload-video-preview" muted />
            ) : (
              <div className="upload-drop-content">
                <HiVideoCamera size={40} />
                <p>Click to select video file</p>
                <span className="upload-hint">MP4, WebM, or OGG</span>
              </div>
            )}
          </label>
          <input type="file" id="video-file-input" accept="video/*" hidden onChange={handleVideoFile} />

          {/* Thumbnail */}
          <label className="upload-drop-zone upload-thumb-zone" htmlFor="thumb-file-input" id="thumb-drop-zone">
            {thumbPreview ? (
              <img src={thumbPreview} alt="Thumbnail preview" className="upload-thumb-preview" />
            ) : (
              <div className="upload-drop-content">
                <HiPhotograph size={40} />
                <p>Click to select thumbnail</p>
                <span className="upload-hint">PNG, JPG, or WebP</span>
              </div>
            )}
          </label>
          <input type="file" id="thumb-file-input" accept="image/*" hidden onChange={handleThumbnail} />
        </div>

        <div className="input-group">
          <label htmlFor="upload-title">Title *</label>
          <input
            id="upload-title"
            type="text"
            className="input-field"
            placeholder="Add a title to your video"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label htmlFor="upload-desc">Description</label>
          <textarea
            id="upload-desc"
            className="input-field"
            placeholder="Tell viewers about your video"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="input-group">
          <label htmlFor="upload-duration">Duration (seconds)</label>
          <input
            id="upload-duration"
            type="number"
            className="input-field"
            placeholder="e.g. 120"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading && (
          <div className="upload-progress">
            <div className="upload-progress-bar" style={{ width: `${progress}%` }} />
            <span className="upload-progress-text">{progress}% uploaded</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          id="upload-submit"
        >
          {loading ? `Uploading... ${progress}%` : 'Publish Video'}
        </button>
      </form>
    </div>
  );
}
