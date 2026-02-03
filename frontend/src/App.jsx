import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import SummaryDisplay from './components/SummaryDisplay';
import WikipediaLookup from './components/WikipediaLookup';
import DownloadButton from './components/DownloadButton';
import About from './components/About';
import './App.css';

function App() {
  const [uploadedData, setUploadedData] = useState(null);
  const [moreInfo, setMoreInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const handleUploadSuccess = (data) => {
    setUploadedData(data);
    setMoreInfo(null); // Reset more info data
  };

  const handleKnowMoreSuccess = (data) => {
    setMoreInfo(data);
  };

  return (
    <div className="App">
      {currentPage === 'home' ? (
        <>
          <header className="App-header">
            <div className="header-content">
              <div>
                <h1>✨ PaperPilot AI</h1>
                <p>Summarize PDFs and text, then learn more with just one click</p>
              </div>
              <button 
                className="nav-btn about-nav-btn"
                onClick={() => setCurrentPage('about')}
                title="About"
              >
                About
              </button>
            </div>
          </header>

          <main className="App-main">
            <div className="container">
              <FileUpload 
                onUploadSuccess={handleUploadSuccess} 
                loading={loading}
                setLoading={setLoading}
              />

              {uploadedData && (
                <>
                  <SummaryDisplay data={uploadedData} />
                  
                  <WikipediaLookup 
                    onLookupSuccess={handleKnowMoreSuccess}
                    loading={loading}
                    setLoading={setLoading}
                  />

                  {moreInfo && moreInfo.found && (
                    <div className="more-info-result">
                      <h3>ℹ️ {moreInfo.title}</h3>
                      <p>{moreInfo.summary}</p>
                      <a href={moreInfo.url} target="_blank" rel="noopener noreferrer">
                        Learn more →
                      </a>
                    </div>
                  )}

                  <DownloadButton 
                    uploadedData={uploadedData}
                    moreInfo={moreInfo}
                    loading={loading}
                    setLoading={setLoading}
                  />
                </>
              )}
            </div>
          </main>

          <footer className="App-footer">
            <p>© 2024 PaperPilot AI</p>
          </footer>
        </>
      ) : (
        <>
          <About />
          <div className="about-footer">
            <button 
              className="back-btn"
              onClick={() => setCurrentPage('home')}
            >
              ← Back to PaperPilot AI
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
