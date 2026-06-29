import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMail, HiLockClosed, HiUser } from 'react-icons/hi';
import logo from '../assets/logo.png';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({
        email: form.email || undefined,
        username: form.username || undefined,
        password: form.password,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="login-page">
      <div className="auth-container card-glass">
        <div className="auth-header">
          <img src={logo} alt="Tea Logo" className="auth-logo-img" />
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue to Tea</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} id="login-form">
          <div className="input-group">
            <label htmlFor="login-email">Email</label>
            <div className="input-with-icon">
              <HiMail className="input-icon" />
              <input
                id="login-email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="login-username">Or Username</label>
            <div className="input-with-icon">
              <HiUser className="input-icon" />
              <input
                id="login-username"
                type="text"
                className="input-field"
                placeholder="your_username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-with-icon">
              <HiLockClosed className="input-icon" />
              <input
                id="login-password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={loading}
            id="login-submit"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
