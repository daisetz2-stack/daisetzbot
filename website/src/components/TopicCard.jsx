import React from 'react';
import { Link } from 'react-router-dom';
import './TopicCard.css';

export default function TopicCard({ topic, lang }) {
  const colors = topic.colors || {
    level1: '#E3B341',
    level2: '#E07A3F',
    level3: '#C06C84',
    level4: '#4C78A8',
    level5: '#2A8F87',
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return lang === 'en'
      ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Link to={`/topic/${topic.id}`} className="topic-card">
      <div className="card-content">
        <h3 className="card-title">{topic.keyword[lang]}</h3>
        <p className="card-date text-muted">{formatDate(topic.created)}</p>
        <div className="level-dots">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className="level-dot"
              style={{ backgroundColor: colors[`level${level}`] }}
              aria-label={`Level ${level}`}
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
