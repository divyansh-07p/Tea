import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import VideoCard from '../components/VideoCard';
import Loader from '../components/Loader';
import { HiSearch } from 'react-icons/hi';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      API.get(`/videos?query=${encodeURIComponent(query)}&limit=20`)
        .then(({ data }) => setVideos(data?.videos || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [query]);

  if (loading) return <Loader text={`Searching for "${query}"...`} />;

  return (
    <div className="page" id="search-results-page">
      <h1 className="page-title">
        <HiSearch />
        Results for "{query}"
      </h1>

      {videos.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🔍</span>
          <h3>No results found</h3>
          <p>Try different keywords</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((v) => <VideoCard key={v._id} video={v} />)}
        </div>
      )}
    </div>
  );
}
