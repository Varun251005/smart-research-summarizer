import React from 'react';
import axios from 'axios';
import './DownloadButton.css';

const API_URL = 'http://localhost:5000';

function DownloadButton({ uploadedData, moreInfo, loading, setLoading }) {
  const handleDownload = async () => {
    if (!uploadedData) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', uploadedData.filename.replace('.pdf', ''));
      formData.append('original_text', uploadedData.extracted_text);
      formData.append('summary', uploadedData.summary);

      if (moreInfo && moreInfo.found) {
        formData.append('wikipedia_title', moreInfo.title);
        formData.append('wikipedia_summary', moreInfo.summary);
        formData.append('wikipedia_url', moreInfo.url);
      }

      const response = await axios.post(`${API_URL}/generate-pdf`, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${uploadedData.filename.replace('.pdf', '')}_summary.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Error generating PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!uploadedData) return null;

  return (
    <div className="download-section">
      <button 
        className="download-button"
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? 'Generating PDF...' : '⬇️ Download Summary as PDF'}
      </button>
    </div>
  );
}

export default DownloadButton;
