import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LevelSection from '../components/LevelSection';
import './TopicDetail.css';

export default function TopicDetail({ lang }) {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/data/topics/${id}.json`)
      .then((res) => res.json())
      .then((data) => {
        setTopic(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load topic:', err);
        setLoading(false);
      });
  }, [id]);

  const text = {
    en: {
      back: '← Back to Archive',
      sources: 'Sources',
      loading: 'Loading...',
      notFound: 'Topic not found',
    },
    ja: {
      back: '← アーカイブに戻る',
      sources: '出典',
      loading: '読み込み中...',
      notFound: 'トピックが見つかりません',
    },
  };

  if (loading) {
    return (
      <div className="topic-detail">
        <div className="container">
          <p className="text-center text-muted">{text[lang].loading}</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="topic-detail">
        <div className="container">
          <p className="text-center text-muted">{text[lang].notFound}</p>
          <div className="text-center" style={{ marginTop: 'var(--spacing-lg)' }}>
            <Link to="/" className="back-link">
              {text[lang].back}
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="topic-detail">
      <div className="container">
        <Link to="/" className="back-link">
          {text[lang].back}
        </Link>

        <div className="topic-header">
          <h1 className="topic-title">{topic.keyword[lang]}</h1>
          <p className="topic-date text-muted">{formatDate(topic.created)}</p>
        </div>

        <div className="levels-container">
          {topic.levels[lang].map((level) => (
            <LevelSection
              key={level.level}
              level={level}
              color={colors[`level${level.level}`]}
            />
          ))}
        </div>

        {topic.sources && topic.sources.length > 0 && (
          <div className="sources-section">
            <h3 className="sources-title">{text[lang].sources}</h3>
            <ul className="sources-list">
              {topic.sources.map((source, idx) => (
                <li key={idx} className="source-item">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    {source.title}
                  </a>
                  <span className="source-lang text-muted">({source.language})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
