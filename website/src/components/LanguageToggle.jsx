import React from 'react';
import './LanguageToggle.css';

export default function LanguageToggle({ currentLang, onToggle }) {
  return (
    <div className="language-toggle">
      <button
        className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
        onClick={() => onToggle('en')}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        className={`lang-btn ${currentLang === 'ja' ? 'active' : ''}`}
        onClick={() => onToggle('ja')}
        aria-label="日本語に切り替え"
      >
        日
      </button>
    </div>
  );
}
