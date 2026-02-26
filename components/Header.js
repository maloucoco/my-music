'use client';

export default function Header() {
  return (
    <nav className="navbar">
      <div className="nav-brand">🎵 Malou音乐</div>
      <ul className="nav-links">
        <li><a href="#home">首页</a></li>
        <li><a href="https://wmapp.dpdns.org/">博客</a></li>
        <li><a href="#music">音乐</a></li>
        <li><a href="#about">关于</a></li>
      </ul>
    </nav>
  );
}
