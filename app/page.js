'use client';

import { useState } from 'react';
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
  const [loading, setLoading] = useState(false);

  const currentSong = songs[currentIndex];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  };

  const handleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const handleVolumeChange = (val) => {
    setVolume(val);
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
          <a href="https://github.com/你的用户名" target="_blank" rel="noopener noreferrer">
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
            song={currentSong}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onPrev={handlePrev}
            onNext={handleNext}
            onRepeat={handleRepeat}
            isRepeat={isRepeat}
            volume={volume}
            onVolumeChange={handleVolumeChange}
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
