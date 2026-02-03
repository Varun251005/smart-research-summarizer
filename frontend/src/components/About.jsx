import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>✨ PaperPilot AI</h1>
        <p>Summarize PDFs and text, then learn more with just one click</p>
      </header>

      <main className="about-main">
        <div className="profile-section">
          <div className="profile-image-wrapper">
            <div className="profile-image">
              <span className="profile-initials">VP</span>
            </div>
          </div>

          <h2 className="profile-name">VarunKumar R</h2>
          <p className="profile-title">Student | Developer | AI Enthusiast</p>
        </div>

        <section className="about-section">
          <h3 className="section-title">About Me</h3>
          <p className="about-text">
            Hello! I'm <span className="highlight">VarunKumar R</span>, a passionate developer and AI enthusiast 
            dedicated to building intelligent solutions that simplify complex tasks. PaperPilot AI is my project 
            designed to revolutionize document summarization using cutting-edge AI technology.
          </p>
          <p className="about-text">
            I work with Python, React, FastAPI, and modern web technologies to create smart, user-friendly 
            applications. My goal is to make advanced AI tools accessible to everyone, helping professionals 
            and students save time and extract meaningful insights from documents effortlessly.
          </p>
          <p className="about-text">
            When I'm not coding, I'm exploring new AI frameworks, contributing to open-source projects, and 
            learning about the latest developments in machine learning and natural language processing.
          </p>
        </section>

        <section className="features-section">
          <h3 className="section-title">PaperPilot AI Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h4>PDF Summarization</h4>
              <p>Upload PDF files and get instant summaries with advanced text extraction</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✍️</div>
              <h4>Text Summarization</h4>
              <p>Paste any text and get concise, meaningful summaries instantly</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h4>Know More (Wikipedia)</h4>
              <p>Click "Know More" to fetch relevant Wikipedia information about your topics</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h4>PDF Export</h4>
              <p>Download summaries as beautifully formatted PDF documents</p>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <h3 className="section-title">Get In Touch</h3>
          <div className="social-links">
            <a href="https://github.com" className="social-btn github-btn" target="_blank" rel="noopener noreferrer">
              <span className="social-icon">🔗</span>
              GitHub
            </a>
            <a href="https://linkedin.com" className="social-btn linkedin-btn" target="_blank" rel="noopener noreferrer">
              <span className="social-icon">💼</span>
              LinkedIn
            </a>
            <a href="https://instagram.com" className="social-btn instagram-btn" target="_blank" rel="noopener noreferrer">
              <span className="social-icon">📷</span>
              Instagram
            </a>
          </div>
        </section>

        <section className="tech-stack-section">
          <h3 className="section-title">Tech Stack</h3>
          <div className="tech-grid">
            <span className="tech-badge">Python</span>
            <span className="tech-badge">FastAPI</span>
            <span className="tech-badge">React</span>
            <span className="tech-badge">PyPDF2</span>
            <span className="tech-badge">Wikipedia API</span>
            <span className="tech-badge">Axios</span>
            <span className="tech-badge">NLP</span>
            <span className="tech-badge">OCR</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;
