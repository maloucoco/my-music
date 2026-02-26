'use client';

import { useState, useRef, useEffect } from 'react';

export default function Player({ song, isPlaying: externalIsPlaying, onPlayPause, onPrev, onNext, onRepeat, isRepeat, volume, onVolumeChange, loading }) {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [localLoading, setLocalLoading] = useState(false);

  // 初始化音频（只在组件挂载时创建一次）
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setCurrentTime(0);
    };
    const handleLoadStart = () => setLocalLoading(true);
    const handleCanPlay = () => setLocalLoading(false);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        onNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audioRef.current = null;
    };
  }, []); // 空依赖，只执行一次

  // 当歌曲变化时更新 src
  useEffect(() => {
    if (audioRef.current && song) {
      audioRef.current.src = song.src;
      audioRef.current.load();
      setCurrentTime(0);
      if (externalIsPlaying) {
        audioRef.current.play().catch(e => console.error(e));
      }
    }
  }, [song]);

  // 控制播放/暂停
  useEffect(() => {
    if (!audioRef.current) return;
    if (externalIsPlaying) {
      audioRef.current.play().catch(e => console.error(e));
    } else {
      audioRef.current.pause();
    }
  }, [externalIsPlaying]);

  // 控制音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // 控制循环
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isRepeat;
    }
  }, [isRepeat]);

  // 格式化时间
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 进度条点击跳转
  const handleProgressClick = (e) => {
    if (!audioRef.current) return;
    // 如果 duration 未获取到（为0或NaN），无法跳转
    if (!duration || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    // 限制百分比在 0~1 之间
    const clampedPercent = Math.max(0, Math.min(1, percent));
    const newTime = clampedPercent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime); // 立即更新 UI，提高响应感
  };

  // 播放/暂停按钮
  const togglePlay = () => {
    onPlayPause();
  };

  return (
    <div className={`player-content ${externalIsPlaying ? 'playing' : ''}`}>
      <div className="album-section">
        <div className="album-cover">
          <img src={song?.cover} alt="专辑封面" />
          {(localLoading || loading) && (
            <div className="loading active">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
        <div className="song-info">
          <h2 className="song-title">{song?.title}</h2>
          <p className="song-artist">{song?.artist}</p>
          <p className="song-album">{song?.album}</p>
        </div>
      </div>

      <div className="controls-section">
        <div className="progress-area">
          <div className="progress-bar" onClick={handleProgressClick}>
            <div
              className="progress"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="timer">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="control-buttons">
          <button className="control-btn" onClick={onPrev} title="上一首">
            <i className="fas fa-step-backward"></i>
          </button>
          <button className="control-btn play-pause" onClick={togglePlay} title="播放/暂停">
            <i className={`fas ${externalIsPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <button className="control-btn" onClick={onNext} title="下一首">
            <i className="fas fa-step-forward"></i>
          </button>
          <button
            className="control-btn"
            onClick={onRepeat}
            title="单曲循环"
            style={{ color: isRepeat ? '#ff7e5f' : '#fff' }}
          >
            <i className="fas fa-redo"></i>
          </button>
        </div>

        <div className="volume-area">
          <i
            className={`fas fa-volume-${volume === 0 ? 'mute' : volume < 50 ? 'down' : 'up'}`}
            style={{ color: '#ffb347' }}
          ></i>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(parseInt(e.target.value))}
            className="volume-slider"
            title="音量"
          />
          <span>{volume}%</span>
        </div>
      </div>
    </div>
  );
}
