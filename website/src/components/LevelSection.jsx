import React from 'react';
import './LevelSection.css';

export default function LevelSection({ level, data, color }) {
  return (
    <section className="level-section">
      <div className="level-header">
        <div className="level-indicator" style={{ backgroundColor: color }}>
          <span className="level-number">{level.level}</span>
        </div>
        <h2 className="level-title">{level.title}</h2>
      </div>
      <div className="level-content">
        {level.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
