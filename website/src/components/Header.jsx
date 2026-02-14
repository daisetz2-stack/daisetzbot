import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header({ lang }) {
  const text = {
    en: {
      title: '5Levels',
      subtitle: 'Complex concepts explained simply',
      archive: 'Archive',
    },
    ja: {
      title: '5Levels',
      subtitle: '複雑な概念をシンプルに説明',
      archive: 'アーカイブ',
    },
  };

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="header-brand">
            <h1 className="header-title">{text[lang].title}</h1>
            <p className="header-subtitle text-muted">{text[lang].subtitle}</p>
          </Link>
          <nav className="header-nav">
            <Link to="/" className="nav-link">
              {text[lang].archive}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
