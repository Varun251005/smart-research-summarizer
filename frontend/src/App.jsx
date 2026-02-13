import React, { useState } from 'react';
import NotebookLM from './components/NotebookLM';
import About from './components/About';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="App">
      {currentPage === 'home' ? (
        <NotebookLM onNavigate={setCurrentPage} />
      ) : (
        <>
          <About />
          <div className="back-button-container">
            <button
              className="back-btn"
              onClick={() => setCurrentPage('home')}
            >
              ← Back to Home
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
