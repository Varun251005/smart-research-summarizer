import React, { useState } from 'react';
import './SummaryDisplay.css';

function SummaryDisplay({ data }) {
  const [showFullText, setShowFullText] = useState(false);

  if (!data) return null;

  return (
    <div className="summary-display">
      <div className="summary-section">
        <h2>📝 Summary</h2>
        <div className="summary-content">
          <p>{data.summary}</p>
        </div>
      </div>

      <div className="extracted-text-section">
        <div className="section-header">
          <h2>📄 Extracted Text</h2>
          <button 
            className="toggle-button"
            onClick={() => setShowFullText(!showFullText)}
          >
            {showFullText ? 'Show Less' : 'Show More'}
          </button>
        </div>
        
        <div className={`extracted-content ${showFullText ? 'expanded' : ''}`}>
          <p>{data.extracted_text}</p>
          {data.full_text_length > data.extracted_text.length && (
            <div className="truncated-note">
              <em>Showing preview of {data.extracted_text.length} characters out of {data.full_text_length} total</em>
            </div>
          )}
        </div>
      </div>

      <div className="metadata">
        <span className="metadata-item">
          <strong>File:</strong> {data.filename}
        </span>
        <span className="metadata-item">
          <strong>Length:</strong> {data.full_text_length.toLocaleString()} characters
        </span>
      </div>
    </div>
  );
}

export default SummaryDisplay;
