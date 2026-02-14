import React, { useState, useEffect } from 'react';
import TopicCard from '../components/TopicCard';
import './Archive.css';

export default function Archive({ lang }) {
  const [topics, setTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load topics from data directory
    fetch('/data/topics-index.json')
      .then((res) => res.json())
      .then((data) => {
        setTopics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load topics:', err);
        setLoading(false);
      });
  }, []);

  const text = {
    en: {
      title: 'Archive',
      subtitle: 'Explore topics explained in 5 levels',
      search: 'Search topics...',
      noResults: 'No topics found',
      loading: 'Loading topics...',
    },
    ja: {
      title: 'アーカイブ',
      subtitle: '5つのレベルで説明されたトピックを探索',
      search: 'トピックを検索...',
      noResults: 'トピックが見つかりません',
      loading: 'トピックを読み込み中...',
    },
  };

  const filteredTopics = topics.filter((topic) =>
    topic.keyword[lang].toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="archive-page">
        <div className="container">
          <p className="text-center text-muted">{text[lang].loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="archive-page">
      <div className="container">
        <div className="archive-header">
          <h2 className="archive-title">{text[lang].title}</h2>
          <p className="archive-subtitle text-muted">{text[lang].subtitle}</p>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder={text[lang].search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {filteredTopics.length === 0 ? (
          <p className="text-center text-muted">{text[lang].noResults}</p>
        ) : (
          <div className="topics-grid">
            {filteredTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
