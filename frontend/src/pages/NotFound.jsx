import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-page" id="not-found-page">
      <div className="not-found-content">
        <img src={logo} alt="Tea Logo" className="not-found-logo-img" />
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-text">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary btn-lg">Go Home</Link>
      </div>
    </div>
  );
}
