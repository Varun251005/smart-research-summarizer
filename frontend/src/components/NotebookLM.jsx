import React, { useState, useRef } from 'react';
import axios from 'axios';
import './NotebookLM.css';

const API_URL = 'http://localhost:5000';

function NotebookLM({ onNavigate }) {
  const [sources, setSources] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wikiInfo, setWikiInfo] = useState(null);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/upload`, formData);
      
      if (response.data.success) {
        setSources([{ name: file.name, type: 'pdf', data: response.data }]);
        setSummary(response.data.summary);
        setAudioUrl(null);
      }
    } catch (error) {
      alert(error.response?.data?.detail || 'Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  const handleTextPaste = async (text) => {
    if (!text || text.length < 50) {
      alert('Please enter at least 50 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/summarize-text`, { text });
      
      if (response.data.success) {
        setSources([{ name: 'Pasted Text', type: 'text', data: response.data }]);
        setSummary(response.data.summary);
        setAudioUrl(null);
      }
    } catch (error) {
      alert(error.response?.data?.detail || 'Error processing text');
    } finally {
      setLoading(false);
    }
  };

  const generateAudioOverview = async () => {
    if (!summary) return;

    setAudioLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/generate-audio`,
        { summary },
        { responseType: 'blob' }
      );
      
      const url = URL.createObjectURL(response.data);
      setAudioUrl(url);
      
      // Auto-play audio
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 100);
    } catch (error) {
      alert('Error generating audio overview');
    } finally {
      setAudioLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/know-more`, {
        params: { query: searchQuery, sentences: 5 }
      });
      
      if (response.data.found) {
        setWikiInfo(response.data);
      } else {
        alert('No information found');
      }
    } catch (error) {
      alert('Error searching for information');
    } finally {
      setLoading(false);
    }
  };

  const [textInput, setTextInput] = useState('');

  return (
    <div className="notebooklm-container">
      <header className="notebooklm-header">
        <div className="header-left">
          <h1>📓 Mini NotebookLM</h1>
        </div>
        <button className="about-link" onClick={() => onNavigate('about')}>
          About
        </button>
      </header>

      <main className="notebooklm-main">
        {!sources.length ? (
          <div className="welcome-screen">
            <div className="welcome-content">
              <h2>Create Audio and Video Overviews from<br /><span className="highlight">your notes</span></h2>
              
              <div className="search-section">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search the web for new sources"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button className="search-btn" onClick={handleSearch}>→</button>
                </div>
                <div className="search-options">
                  <button className="option-btn">🌐 Web</button>
                  <button className="option-btn">⚡ Fast Research</button>
                </div>
              </div>

              <div className="upload-section">
                <p className="upload-text">or drop your files</p>
                <p className="file-types">pdf, images, docs, audio, and more</p>
                
                <div className="upload-buttons">
                  <button className="upload-btn" onClick={() => fileInputRef.current?.click()}>
                    <span>📤</span> Upload files
                  </button>
                  <button className="upload-btn">
                    <span>🔗</span> Websites
                  </button>
                  <button className="upload-btn">
                    <span>☁️</span> Drive
                  </button>
                  <button className="upload-btn" onClick={() => {
                    const text = prompt('Paste your text:');
                    if (text) handleTextPaste(text);
                  }}>
                    <span>📋</span> Copied text
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>

              {loading && (
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <p>Processing your content...</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="content-screen">
            <div className="sidebar">
              <div className="sidebar-header">
                <h3>Sources</h3>
                <button className="add-source-btn" onClick={() => {
                  setSources([]);
                  setSummary(null);
                  setAudioUrl(null);
                  setWikiInfo(null);
                }}>
                  + Add
                </button>
              </div>
              
              <div className="sources-list">
                {sources.map((source, idx) => (
                  <div key={idx} className="source-item">
                    <span className="source-icon">{source.type === 'pdf' ? '📄' : '📝'}</span>
                    <span className="source-name">{source.name}</span>
                  </div>
                ))}
              </div>

              <div className="audio-overview-section">
                <h4>🎧 Audio Overview</h4>
                <p className="audio-description">
                  Listen to a summary of your sources
                </p>
                
                {!audioUrl ? (
                  <button
                    className="generate-audio-btn"
                    onClick={generateAudioOverview}
                    disabled={audioLoading || !summary}
                  >
                    {audioLoading ? (
                      <>
                        <span className="spinner-small"></span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <span>▶️</span> Generate
                      </>
                    )}
                  </button>
                ) : (
                  <div className="audio-player">
                    <audio ref={audioRef} controls src={audioUrl} className="audio-element">
                      Your browser does not support audio playback.
                    </audio>
                    <button
                      className="regenerate-btn"
                      onClick={() => {
                        setAudioUrl(null);
                        generateAudioOverview();
                      }}
                    >
                      🔄 Regenerate
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="main-content">
              <div className="content-header">
                <h2>Summary</h2>
              </div>

              <div className="summary-card">
                <div className="summary-text">
                  {summary}
                </div>
              </div>

              <div className="search-more-section">
                <h3>🔍 Learn More</h3>
                <div className="search-more-box">
                  <input
                    type="text"
                    placeholder="Search for related topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button onClick={handleSearch} disabled={loading}>
                    Search
                  </button>
                </div>

                {wikiInfo && wikiInfo.found && (
                  <div className="wiki-result">
                    <h4>{wikiInfo.title}</h4>
                    <p>{wikiInfo.summary}</p>
                    <a href={wikiInfo.url} target="_blank" rel="noopener noreferrer">
                      Read more on Wikipedia →
                    </a>
                  </div>
                )}
              </div>

              {sources[0]?.data?.extracted_text && (
                <div className="original-text-section">
                  <h3>📄 Original Content</h3>
                  <div className="original-text">
                    {sources[0].data.extracted_text}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default NotebookLM;
