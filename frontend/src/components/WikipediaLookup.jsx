import React, { useState } from 'react';
import axios from 'axios';
import './WikipediaLookup.css';

const API_URL = 'http://localhost:5000';

function WikipediaLookup({ onLookupSuccess, loading, setLoading }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  const handleLookup = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/know-more`, {
        params: { query: query.trim(), sentences: 3 }
      });

      if (response.data.found) {
        onLookupSuccess(response.data);
        setQuery(''); // Clear the input after successful lookup
      } else {
        setError(response.data.message || 'No information found for this topic. Try a different search term.');
        onLookupSuccess(null);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Error fetching information. Please check your internet connection and try again.';
      setError(errorMsg);
      console.error('Know more lookup error:', err);
      onLookupSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wikipedia-lookup">
      <h2>ℹ️ Know More About This Topic</h2>
      <form onSubmit={handleLookup} className="lookup-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a topic to learn more..."
          className="lookup-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="lookup-button"
          disabled={loading || !query.trim()}
        >
          {loading ? 'Searching...' : 'Know More'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default WikipediaLookup;
