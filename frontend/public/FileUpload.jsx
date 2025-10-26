import React, { useState, useRef } from 'react';
import axios from 'axios';
import './FileUpload.css';

const API_URL = 'http://localhost:8000';

function FileUpload({ onUploadSuccess, loading, setLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedContent, setPastedContent] = useState('');
  const [pastedImage, setPastedImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      setSelectedFile(file);
      setPastedContent('');
      setPastedImage(null);
      setError(null);
    } else {
      setError('Please select a PDF or image file');
    }
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          setPastedImage(event.target.result);
          setSelectedFile(blob);
          setPastedContent('');
          setError(null);
        };
        reader.readAsDataURL(blob);
        return;
      }
    }
    const text = e.clipboardData.getData('text');
    if (text) {
      setPastedContent(text);
      setSelectedFile(null);
      setPastedImage(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    setError(null);
    try {
      if (pastedContent && !selectedFile) {
        const response = await axios.post(`${API_URL}/summarize-text`, { text: pastedContent });
        if (response.data) {
          onUploadSuccess({ success: true, extracted_text: pastedContent, summary: response.data.summary, filename: 'Pasted Text' });
          setPastedContent('');
        }
        return;
      }
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const response = await axios.post(`${API_URL}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (response.data.success) {
          onUploadSuccess(response.data);
          setSelectedFile(null);
          setPastedImage(null);
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error processing content');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => { fileInputRef.current.click(); };
  const clearContent = () => { setSelectedFile(null); setPastedContent(''); setPastedImage(null); setError(null); };

  return (
    <div className='file-upload-container'>
      <div className='upload-box'>
        <div className='upload-header'>
          <h2> Smart Research Summarizer</h2>
          <p>Upload files or paste content for AI summaries</p>
        </div>
        <div className='upload-actions'>
          <button className='plus-button' onClick={triggerFileInput}>
            <span className='plus-icon'>+</span>
            <span className='button-text'>Add PDF or Image</span>
          </button>
          <input ref={fileInputRef} type='file' accept='application/pdf,image/*' onChange={handleFileSelect} style={{ display: 'none' }} />
        </div>
        <div className='paste-section'>
          <div className='paste-header'>
            <span>✍️</span>
            <span>Type or paste your text/image here</span>
          </div>
          <textarea 
            placeholder='Type your text here or paste (Ctrl+V) text/images...' 
            value={pastedContent} 
            onChange={(e) => setPastedContent(e.target.value)} 
            onPaste={handlePaste} 
            className='paste-textarea' 
          />
          {pastedContent && (
            <div className='text-counter'>
              {pastedContent.length} characters
            </div>
          )}
        </div>
        {selectedFile && !pastedImage && (
          <div className='preview-box'>
            <div className='file-preview'>
              <span className='file-icon'>{selectedFile.type === 'application/pdf' ? '📄' : '🖼️'}</span>
              <span className='file-name'>{selectedFile.name}</span>
              <button className='clear-btn' onClick={clearContent}>✕</button>
            </div>
          </div>
        )}
        
        {pastedImage && (
          <div className='preview-box'>
            <div className='image-preview'>
              <img src={pastedImage} alt='Pasted' />
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
        
        {(selectedFile || pastedContent || pastedImage) && (
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
