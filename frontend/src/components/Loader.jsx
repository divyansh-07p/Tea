import './Loader.css';

export default function Loader({ size = 'md', text }) {
  return (
    <div className="loader-container">
      <div className={`loader-spinner loader-${size}`}>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}
