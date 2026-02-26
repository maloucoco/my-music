'use client';

import { useState, useRef, useEffect } from 'react';
import { songs } from '@/lib/songs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Player from '@/components/Player';
import Playlist from '@/components/Playlist';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  const currentSong = songs[currentIndex];

  // 初始化 audio 元素并设置事件监听
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume / 100;

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleLoadStart = () => setLoading(true);
    const handleCanPlay = () => setLoading(false);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
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
    };
  }, []);

  // 当前歌曲变化时加载
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.src;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error(e));
      }
    }
  }, [currentIndex]);

  // 播放/暂停控制
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error(e));
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
  };

  const handleRepeat = () => {
    setIsRepeat(!isRepeat);
    if (audioRef.current) {
      audioRef.current.loop = !isRepeat;
    }
  };

  const handleVolumeChange = (val) => {
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val / 100;
    }
  };

  const handleProgressClick = (percent) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = percent * duration;
    }
  };

  const handleSelectSong = (index) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="container">
      <Header />

      {/* 个人介绍区域 */}
      <section className="profile-section" id="about">
        <div className="profile-avatar">
          <img
            src="https://avatars.githubusercontent.com/u/263480411?v=4"
            alt="Avatar"
          />
        </div>
        <h1 className="profile-name">Malou(吗喽)</h1>
        <p className="profile-bio">音乐爱好者 · 前端开发 · 生活记录者</p>
        <p className="profile-description">
          热爱音乐和代码，喜欢分享生活中的美好。这个页面是我的个人空间，你可以在这里听听我喜欢的歌，也可以找到我的社交账号。
        </p>
        <div className="social-links">
          <a href="https://github.com/maloucoco" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://twitter.com/你的用户名" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com/你的用户名" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://spotify.com/你的用户名" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-spotify"></i>
          </a>
        </div>
      </section>

      {/* 音乐播放器区域 */}
      <section className="player-section" id="music">
        <div className="player-container">
          <Player
            currentSong={currentSong}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            onPlayPause={handlePlayPause}
            onPrev={handlePrev}
            onNext={handleNext}
            onRepeat={handleRepeat}
            isRepeat={isRepeat}
            onVolumeChange={handleVolumeChange}
            onProgressClick={handleProgressClick}
            loading={loading}
          />
          <Playlist
            songs={songs}
            currentIndex={currentIndex}
            isPlaying={isPlaying}
            onSelect={handleSelectSong}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
