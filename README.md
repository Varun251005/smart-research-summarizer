# 📓 Mini NotebookLM

A lightweight, AI-powered document summarization tool inspired by Google's NotebookLM. Transform your PDFs and text documents into intelligent summaries with audio overview capabilities.

![Mini NotebookLM](https://img.shields.io/badge/Version-2.0.0-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-teal)

## ✨ Features

- 📄 **PDF Upload & Processing** - Extract and summarize content from PDF documents
- ✍️ **Text Input** - Paste or type text directly for instant summarization
- 🎧 **Audio Overview** - Generate audio summaries using text-to-speech
- 🔍 **Wikipedia Integration** - Search and learn more about topics
- 📊 **Smart Summarization** - Intelligent extractive summarization algorithm
- 💾 **PDF Export** - Download summaries as formatted PDF documents
- 🎨 **Modern UI** - Beautiful, responsive interface inspired by NotebookLM

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd smart-research-summarizer/backend/app
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the backend server:
```bash
python main.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd smart-research-summarizer/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📦 Dependencies

### Backend
- FastAPI - Modern web framework
- PyPDF2 - PDF text extraction
- gTTS - Google Text-to-Speech
- Wikipedia-API - Wikipedia integration
- ReportLab - PDF generation
- pytesseract - OCR support (optional)

### Frontend
- React 18.2
- Axios - HTTP client
- Modern CSS with gradients and animations

## 🎯 Usage

1. **Upload a Document**
   - Click "Upload files" and select a PDF
   - Or paste text directly into the text area

2. **View Summary**
   - The AI will automatically generate a concise summary
   - View the original content in the expandable section

3. **Generate Audio Overview**
   - Click "Generate" in the Audio Overview section
   - Listen to your summary as audio
   - Download the audio file if needed

4. **Learn More**
   - Use the search feature to find related Wikipedia articles
   - Expand your knowledge on the topic

5. **Export**
   - Download your summary as a PDF document
   - Includes original text and Wikipedia information

## 🏗️ Project Structure

```
smart-research-summarizer/
├── backend/
│   └── app/
│       ├── main.py          # FastAPI application
│       ├── utils.py         # Helper functions
│       └── requirements.txt # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NotebookLM.jsx    # Main interface
│   │   │   ├── NotebookLM.css    # Styling
│   │   │   ├── About.jsx         # About page
│   │   │   └── About.css         # About styling
│   │   ├── App.jsx          # Root component
│   │   ├── App.css          # Global styles
│   │   └── index.js         # Entry point
│   └── package.json         # Node dependencies
└── README.md
```

## 🔧 API Endpoints

- `POST /upload` - Upload and process PDF files
- `POST /summarize-text` - Summarize pasted text
- `POST /generate-audio` - Generate audio overview
- `GET /know-more` - Search Wikipedia
- `POST /generate-pdf` - Export summary as PDF

## 🎨 Features in Detail

### Intelligent Summarization
The app uses an improved extractive summarization algorithm that:
- Identifies key sentences based on position and content
- Maintains context and coherence
- Produces concise, readable summaries

### Audio Overview
- Converts summaries to natural-sounding speech
- Supports playback controls
- Downloadable MP3 format

### Modern Interface
- Gradient backgrounds and smooth animations
- Responsive design for all devices
- Intuitive user experience
- Dark theme optimized for readability

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 👨‍💻 Developer

**VarunKumar R**
- Student | Developer | AI Enthusiast
- GitHub: [@Varun251005](https://github.com/Varun251005)
- Instagram: [@varunnn.r](https://www.instagram.com/varunnn.r)

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Inspired by Google's NotebookLM
- Built with modern web technologies
- Powered by open-source libraries

## 🐛 Known Issues

- OCR support requires Tesseract installation
- Large PDFs may take longer to process
- Audio generation requires internet connection

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Advanced AI models integration
- [ ] Collaborative features
- [ ] Cloud storage integration
- [ ] Mobile app version
- [ ] Video overview generation

---

Made with ❤️ by VarunKumar R
