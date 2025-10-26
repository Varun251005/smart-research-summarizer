import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import SummaryDisplay from './components/SummaryDisplay';
import WikipediaLookup from './components/WikipediaLookup';
import DownloadButton from './components/DownloadButton';
import './App.css';

function App() {
  const [uploadedData, setUploadedData] = useState(null);
  const [wikipediaData, setWikipediaData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUploadSuccess = (data) => {
    setUploadedData(data);
    setWikipediaData(null); // Reset Wikipedia data
  };

  const handleWikipediaSuccess = (data) => {
    setWikipediaData(data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📚 Smart Research Summarizer</h1>
        <p>Upload research papers, get AI-powered summaries, and explore related topics</p>
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
                onLookupSuccess={handleWikipediaSuccess}
                loading={loading}
                setLoading={setLoading}
              />

              {wikipediaData && wikipediaData.found && (
                <div className="wikipedia-result">
                  <h3>📖 {wikipediaData.title}</h3>
                  <p>{wikipediaData.summary}</p>
                  <a href={wikipediaData.url} target="_blank" rel="noopener noreferrer">
                    Read more on Wikipedia →
                  </a>
                </div>
              )}

              <DownloadButton 
                uploadedData={uploadedData}
                wikipediaData={wikipediaData}
                loading={loading}
                setLoading={setLoading}
              />
            </>
          )}
        </div>
      </main>

      <footer className="App-footer">
        <p>© 2024 Smart Research Summarizer | Powered by AI</p>
      </footer>
    </div>
  );
}

export default App;
