import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LanguageToggle from './components/LanguageToggle';
import Archive from './pages/Archive';
import TopicDetail from './pages/TopicDetail';
import './styles/global.css';

export default function App() {
  const [lang, setLang] = useState('en');

  return (
    <Router>
      <div className="app">
        <LanguageToggle currentLang={lang} onToggle={setLang} />
        <Header lang={lang} />
        <Routes>
          <Route path="/" element={<Archive lang={lang} />} />
          <Route path="/topic/:id" element={<TopicDetail lang={lang} />} />
        </Routes>
      </div>
    </Router>
  );
}
