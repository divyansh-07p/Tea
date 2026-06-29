import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { HiUserGroup } from 'react-icons/hi';
import './Subscriptions.css';

export default function Subscriptions() {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      API.get(`/subscriptions/c/${user._id}`)
        .then(({ data }) => setChannels(data?.data || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <Loader text="Loading subscriptions..." />;

  return (
    <div className="page" id="subscriptions-page">
      <h1 className="page-title"><HiUserGroup /> Subscriptions</h1>

      {channels.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📺</span>
          <h3>No subscriptions yet</h3>
          <p>Subscribe to channels to see them here</p>
        </div>
      ) : (
        <div className="subscriptions-grid">
          {channels.map((ch) => (
            <Link
              key={ch.channelId}
              to={`/channel/${ch.channelName}`}
              className="subscription-card card"
              id={`sub-${ch.channelId}`}
            >
              {ch.avatar ? (
                <img src={ch.avatar} alt={ch.channelName} className="avatar avatar-lg" />
              ) : (
                <div className="subscription-avatar-placeholder">
                  {ch.channelName?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <h3 className="subscription-name">{ch.channelName}</h3>
              {ch.email && <p className="subscription-email">{ch.email}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
