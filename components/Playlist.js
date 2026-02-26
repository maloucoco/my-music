'use client';

export default function Playlist({ songs, currentIndex, isPlaying, onSelect }) {
  return (
    <div className="playlist-section">
      <h3 className="playlist-title"><i className="fas fa-list"></i> 播放列表</h3>
      <ul className="playlist">
        {songs.map((song, index) => (
          <li
            key={song.id}
            className={index === currentIndex ? 'active' : ''}
            onClick={() => onSelect(index)}
          >
            <span className="play-icon">
              <i className={`fas ${index === currentIndex && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </span>
            <div className="song-details">
              <div className="song-name">{song.title}</div>
              <div className="song-artist">{song.artist}</div>
            </div>
            <span className="song-duration">{song.duration}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
