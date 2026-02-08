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

          <h2 className="profile-name">𝓥𝓪𝓻𝓾𝓷𝓚𝓾𝓶𝓪𝓻 𝓡</h2>
          <p className="profile-title">STUDENT | DEVELOPER | AI ENTHUSIAST</p>
        </div>

        <section className="about-section">
          <p className="about-text">
            Driven by curiosity and innovation, I build intelligent AI-powered solutions that turn complex tasks into simple experiences.
            PaperPilot AI is my flagship project, reimagining document summarization through advanced artificial intelligence.
          </p>
        </section>

        <section className="contact-section">
          <h3 className="section-title">Get In Touch</h3>
          <div className="social-links">
            <a href="https://github.com/Varun251005" className="social-btn github-btn" target="_blank" rel="noopener noreferrer">
              <span className="social-icon">🔗</span>
              GitHub
            </a>
            <a href="https://linkedin.com" className="social-btn linkedin-btn" target="_blank" rel="noopener noreferrer">
              <span className="social-icon">💼</span>
              LinkedIn
            </a>
            <a href="https://www.instagram.com/varunnn.r?igsh=MXFzYmYwMWtzNnQ2eg==" className="social-btn instagram-btn" target="_blank" rel="noopener noreferrer">
              <span className="social-icon">📷</span>
              Instagram
            </a>
          </div>
        </section>

        
      </main>
    </div>
  );
}

export default About;
