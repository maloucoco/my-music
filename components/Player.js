'use client';

import { useRef, useEffect } from 'react';

export default function Player({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  onPlayPause,
  onPrev,
  onNext,
  onRepeat,
  isRepeat,
  onVolumeChange,
  onProgressClick,
  loading,
}) {
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // 当 currentSong 变化时，更新 audio 的 src
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.src;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error(e));
      }
    }
  }, [currentSong]);

  // 监听播放状态
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error(e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // 监听音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // 监听循环模式
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isRepeat;
    }
  }, [isRepeat]);

  // 格式化时间
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`player-content ${isPlaying ? 'playing' : ''}`}>
      {/* 隐藏的 audio 元素，由 ref 控制 */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => onProgressClick.currentTime?.(e.target.currentTime)} // 实际通过父组件传递的 onTimeUpdate 处理
        onLoadedMetadata={(e) => onProgressClick.duration?.(e.target.duration)}
        onEnded={onNext}
      />

      <div className="album-section">
        <div className="album-cover">
          <img src={currentSong?.cover} alt="专辑封面" />
          {loading && (
            <div className="loading active">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
        <div className="song-info">
          <h2 className="song-title">{currentSong?.title}</h2>
          <p className="song-artist">{currentSong?.artist}</p>
          <p className="song-album">{currentSong?.album}</p>
        </div>
      </div>

      <div className="controls-section">
        <div className="progress-area">
          <div
            className="progress-bar"
            ref={progressBarRef}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              onProgressClick(percent);
            }}
          >
            <div
              className="progress"
              style={{ width: `${(currentTime / duration) * 100}%` }}
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
          <button className="control-btn play-pause" onClick={onPlayPause} title="播放/暂停">
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
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
