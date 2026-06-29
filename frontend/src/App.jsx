import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoWatch from './pages/VideoWatch';
import UploadVideo from './pages/UploadVideo';
import Channel from './pages/Channel';
import Dashboard from './pages/Dashboard';
import LikedVideos from './pages/LikedVideos';
import WatchHistory from './pages/WatchHistory';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import Tweets from './pages/Tweets';
import Subscriptions from './pages/Subscriptions';
import Settings from './pages/Settings';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth pages — no layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/watch/:videoId" element={<VideoWatch />} />
            <Route path="/channel/:username" element={<Channel />} />

            {/* Protected routes */}
            <Route path="/upload" element={<ProtectedRoute><UploadVideo /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/liked-videos" element={<ProtectedRoute><LikedVideos /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><WatchHistory /></ProtectedRoute>} />
            <Route path="/playlists" element={<ProtectedRoute><Playlists /></ProtectedRoute>} />
            <Route path="/playlist/:playlistId" element={<ProtectedRoute><PlaylistDetail /></ProtectedRoute>} />
            <Route path="/tweets" element={<ProtectedRoute><Tweets /></ProtectedRoute>} />
            <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
