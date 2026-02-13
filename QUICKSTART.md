# 🚀 Quick Start Guide - Mini NotebookLM

## First Time Setup

1. **Run Setup Script**
   ```
   Double-click: setup.bat
   ```
   This will install all required dependencies for both backend and frontend.

2. **Start the Application**
   ```
   Double-click: start.bat
   ```
   This will start both the backend server and frontend application.

3. **Access the Application**
   - Open your browser and go to: `http://localhost:3000`
   - The backend API runs at: `http://localhost:5000`

## Using Mini NotebookLM

### Upload a Document
1. Click the "Upload files" button
2. Select a PDF file from your computer
3. Wait for the processing to complete

### Paste Text
1. Click the "Copied text" button
2. Paste your text in the prompt
3. Click OK to process

### Generate Audio Overview
1. After uploading a document, look for the "Audio Overview" section in the sidebar
2. Click "Generate" button
3. Wait for the audio to be created
4. Play the audio directly in the browser
5. Use the regenerate button to create a new audio version

### Search for More Information
1. After viewing your summary, scroll to the "Learn More" section
2. Enter a topic or keyword related to your document
3. Click "Search" to find Wikipedia articles
4. Read the summary and click the link to learn more

### Features Overview

✅ **PDF Processing** - Upload and extract text from PDF documents
✅ **Text Summarization** - Get intelligent summaries of your content
✅ **Audio Overview** - Listen to your summaries as audio
✅ **Wikipedia Integration** - Search and learn more about topics
✅ **Modern Interface** - Beautiful, easy-to-use design

## Troubleshooting

### Backend won't start
- Make sure Python 3.8+ is installed
- Run `pip install -r backend/app/requirements.txt` manually
- Check if port 5000 is already in use

### Frontend won't start
- Make sure Node.js is installed
- Run `npm install` in the frontend directory manually
- Check if port 3000 is already in use

### Audio generation fails
- Make sure you have an internet connection (required for gTTS)
- Check the browser console for errors

### PDF upload fails
- Make sure the file is a valid PDF
- Check if the PDF contains extractable text (not just images)
- Try a different PDF file

## System Requirements

- **Operating System**: Windows 10 or higher
- **Python**: 3.8 or higher
- **Node.js**: 14 or higher
- **RAM**: 4GB minimum (8GB recommended)
- **Internet**: Required for audio generation and Wikipedia search

## Support

For issues or questions:
- Check the main README.md file
- Visit the GitHub repository
- Contact the developer

---

Enjoy using Mini NotebookLM! 📓✨
