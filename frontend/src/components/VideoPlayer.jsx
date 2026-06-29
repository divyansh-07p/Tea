import { useRef, useState, useEffect } from 'react';
import { HiPlay, HiPause, HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import { formatDuration } from '../utils/helpers';
import './VideoPlayer.css';

export default function VideoPlayer({ src, thumbnail, title }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimeout = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => setCurrentTime(video.currentTime);
    const onLoaded = () => setDuration(video.duration);
    const onEnded = () => setPlaying(false);

    video.addEventListener('timeupdate', onTime);
    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * duration;
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    videoRef.current.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(hideTimeout.current);
    if (playing) {
      hideTimeout.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`video-player ${showControls ? '' : 'hide-controls'}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
      id="video-player"
    >
      <video
        ref={videoRef}
        src={src}
        poster={thumbnail}
        className="video-player-element"
        onClick={togglePlay}
        playsInline
      />

      {!playing && (
        <button className="video-player-play-overlay" onClick={togglePlay} id="video-play-overlay">
          <div className="play-overlay-btn">
            <HiPlay size={48} />
          </div>
        </button>
      )}

      <div className="video-player-controls">
        <div className="video-progress-bar" onClick={handleSeek} id="video-progress">
          <div className="video-progress-buffered" />
          <div className="video-progress-filled" style={{ width: `${progress}%` }} />
          <div className="video-progress-thumb" style={{ left: `${progress}%` }} />
        </div>

        <div className="video-controls-row">
          <div className="video-controls-left">
            <button onClick={togglePlay} className="video-ctrl-btn" id="video-play-btn">
              {playing ? <HiPause size={22} /> : <HiPlay size={22} />}
            </button>

            <button onClick={toggleMute} className="video-ctrl-btn" id="video-mute-btn">
              {muted ? <HiVolumeOff size={20} /> : <HiVolumeUp size={20} />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              className="video-volume-slider"
              id="video-volume"
            />

            <span className="video-time">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </span>
          </div>

          <div className="video-controls-right">
            <button onClick={toggleFullscreen} className="video-ctrl-btn" id="video-fullscreen-btn">
              {isFullscreen ? <MdFullscreenExit size={24} /> : <MdFullscreen size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
