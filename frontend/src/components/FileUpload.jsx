import React, { useState, useRef } from 'react';
import axios from 'axios';
import './FileUpload.css';

const API_URL = 'http://localhost:8000';

function FileUpload({ onUploadSuccess, loading, setLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedContent, setPastedContent] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setPastedContent('');
      setYoutubeUrl('');
      setError(null);
    } else {
      setError('Please select a PDF file');
    }
  };

  const handlePaste = async (e) => {
    // Allow default paste behavior to work naturally
    // The onChange handler will capture the pasted text
    setSelectedFile(null);
    setYoutubeUrl('');
    setError(null);
  };

  const handleUpload = async () => {
    setLoading(true);
    setError(null);
    try {
      // Handle YouTube URL
      if (youtubeUrl && !selectedFile && !pastedContent) {
        const response = await axios.post(`${API_URL}/youtube`, { url: youtubeUrl });
        if (response.data && response.data.success) {
          onUploadSuccess({ 
            success: true, 
            extracted_text: response.data.extracted_text, 
            summary: response.data.summary, 
            filename: response.data.filename || 'YouTube Video',
            full_text_length: response.data.full_text_length
          });
          setYoutubeUrl('');
        }
        return;
      }
      
      // Handle pasted text
      if (pastedContent && !selectedFile && !youtubeUrl) {
        const response = await axios.post(`${API_URL}/summarize-text`, { text: pastedContent });
        if (response.data) {
          onUploadSuccess({ success: true, extracted_text: pastedContent, summary: response.data.summary, filename: 'Pasted Text' });
          setPastedContent('');
        }
        return;
      }
      
      // Handle PDF file
      if (selectedFile && !pastedContent && !youtubeUrl) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const response = await axios.post(`${API_URL}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (response.data.success) {
          onUploadSuccess(response.data);
          setSelectedFile(null);
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error processing content');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => { fileInputRef.current.click(); };
  const clearContent = () => { 
    setSelectedFile(null); 
    setPastedContent(''); 
    setYoutubeUrl('');
    setError(null); 
  };

  return (
    <div className='file-upload-container'>
      <div className='upload-box'>
        <div className='upload-header'>
          <h2>📚 Smart Research Summarizer</h2>
          <p>Upload PDF, paste text, or enter YouTube URL for instant summaries</p>
        </div>
        
        {/* YouTube URL Input */}
        <div className='youtube-section'>
          <div className='input-header'>
            <span>🎥</span>
            <span>YouTube Video URL</span>
          </div>
          <input
            type='text'
            placeholder='Paste YouTube video URL here (e.g., https://www.youtube.com/watch?v=...)'
            value={youtubeUrl}
            onChange={(e) => {
              setYoutubeUrl(e.target.value);
              if (e.target.value) {
                setSelectedFile(null);
                setPastedContent('');
                setError(null);
              }
            }}
            className='youtube-input'
          />
        </div>
        
        <div className='divider'>
          <span>OR</span>
        </div>
        
        <div className='upload-actions'>
          <button className='plus-button' onClick={triggerFileInput}>
            <span className='plus-icon'>+</span>
            <span className='button-text'>Add PDF</span>
          </button>
          <input ref={fileInputRef} type='file' accept='application/pdf' onChange={handleFileSelect} style={{ display: 'none' }} />
        </div>
        
        <div className='divider'>
          <span>OR</span>
        </div>
        <div className='paste-section'>
          <div className='paste-header'>
            <span>✍️</span>
            <span>Type or paste your text here</span>
          </div>
          <textarea 
            placeholder='Type your text here or paste (Ctrl+V) text...' 
            value={pastedContent} 
            onChange={(e) => {
              setPastedContent(e.target.value);
              if (e.target.value) {
                setSelectedFile(null);
                setYoutubeUrl('');
                setError(null);
              }
            }} 
            onPaste={handlePaste}
            className='paste-textarea'
            rows={8}
          />
          {pastedContent && (
            <div className='text-counter'>
              {pastedContent.length} characters
            </div>
          )}
        </div>
        
        {youtubeUrl && (
          <div className='preview-box'>
            <div className='file-preview'>
              <span className='file-icon'>🎥</span>
              <span className='file-name'>{youtubeUrl}</span>
              <button className='clear-btn' onClick={clearContent}>✕</button>
            </div>
          </div>
        )}
        {selectedFile && (
          <div className='preview-box'>
            <div className='file-preview'>
              <span className='file-icon'>📄</span>
              <span className='file-name'>{selectedFile.name}</span>
              <button className='clear-btn' onClick={clearContent}>✕</button>
            </div>
          </div>
        )}
        
        {error && (
          <div className='error-box'>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        {(selectedFile || pastedContent || youtubeUrl) && (
          <button onClick={handleUpload} disabled={loading} className='process-btn'>
            {loading ? (
              <>
                <span className='spinner'>⟳</span>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Generate Summary</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
