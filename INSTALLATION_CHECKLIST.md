# ✅ Mini NotebookLM - Installation Checklist

## Pre-Installation Requirements

### System Requirements
- [ ] Windows 10 or higher
- [ ] 4GB RAM minimum (8GB recommended)
- [ ] 2GB free disk space
- [ ] Internet connection

### Software Requirements
- [ ] Python 3.8 or higher installed
  - Check: Open CMD and type `python --version`
  - Download: https://www.python.org/downloads/
  
- [ ] Node.js 14 or higher installed
  - Check: Open CMD and type `node --version`
  - Download: https://nodejs.org/

- [ ] pip (Python package manager)
  - Check: Open CMD and type `pip --version`
  - Usually comes with Python

- [ ] npm (Node package manager)
  - Check: Open CMD and type `npm --version`
  - Comes with Node.js

## Installation Steps

### Step 1: Download/Clone Project
- [ ] Project downloaded to your computer
- [ ] Extracted to a folder (e.g., C:\summarizer\smart-research-summarizer)

### Step 2: Run Setup
- [ ] Navigate to project folder
- [ ] Double-click `setup.bat`
- [ ] Wait for installation to complete
- [ ] Check for any error messages

### Step 3: Verify Backend Installation
- [ ] Open `backend/app` folder
- [ ] Check if `__pycache__` folder was created
- [ ] Verify no error messages during pip install

### Step 4: Verify Frontend Installation
- [ ] Open `frontend` folder
- [ ] Check if `node_modules` folder was created
- [ ] Verify no error messages during npm install

## Running the Application

### Step 1: Start Services
- [ ] Double-click `start.bat`
- [ ] Two command windows should open:
  - Backend window (Python server)
  - Frontend window (React dev server)

### Step 2: Verify Backend
- [ ] Backend window shows: "Server running at: http://localhost:5000"
- [ ] No error messages in backend window
- [ ] Open browser: http://localhost:5000
- [ ] Should see API information

### Step 3: Verify Frontend
- [ ] Frontend window shows: "Compiled successfully!"
- [ ] Browser automatically opens to http://localhost:3000
- [ ] Mini NotebookLM interface loads correctly
- [ ] No console errors (press F12 to check)

## Testing Features

### Test 1: Text Summarization
- [ ] Click "Copied text" button
- [ ] Paste sample text (at least 50 characters)
- [ ] Click OK
- [ ] Summary appears within a few seconds
- [ ] No error messages

### Test 2: PDF Upload
- [ ] Click "Upload files" button
- [ ] Select a PDF file
- [ ] File uploads successfully
- [ ] Summary appears
- [ ] Original text is visible

### Test 3: Audio Overview
- [ ] After uploading content, find "Audio Overview" section
- [ ] Click "Generate" button
- [ ] Wait for audio generation
- [ ] Audio player appears
- [ ] Audio plays when clicked
- [ ] Can hear the summary

### Test 4: Wikipedia Search
- [ ] Scroll to "Learn More" section
- [ ] Enter a search term
- [ ] Click "Search"
- [ ] Wikipedia result appears
- [ ] Link works correctly

### Test 5: Navigation
- [ ] Click "About" button
- [ ] About page loads
- [ ] Click "Back to Home"
- [ ] Returns to main interface

## Troubleshooting

### Backend Issues

#### Port 5000 Already in Use
- [ ] Close any other applications using port 5000
- [ ] Or edit `backend/app/main.py` to use different port
- [ ] Update `frontend/src/components/NotebookLM.jsx` API_URL

#### Python Dependencies Failed
- [ ] Open CMD as Administrator
- [ ] Navigate to `backend/app`
- [ ] Run: `pip install -r requirements.txt --upgrade`
- [ ] Check for specific error messages

#### Import Errors
- [ ] Verify Python version: `python --version`
- [ ] Should be 3.8 or higher
- [ ] Reinstall dependencies: `pip install -r requirements.txt --force-reinstall`

### Frontend Issues

#### Port 3000 Already in Use
- [ ] Close any other applications using port 3000
- [ ] Or when prompted, choose to run on different port

#### npm Install Failed
- [ ] Delete `node_modules` folder
- [ ] Delete `package-lock.json`
- [ ] Run: `npm install` again
- [ ] Try: `npm install --legacy-peer-deps`

#### Compilation Errors
- [ ] Check Node.js version: `node --version`
- [ ] Should be 14 or higher
- [ ] Clear cache: `npm cache clean --force`
- [ ] Reinstall: `npm install`

### Audio Generation Issues

#### Audio Not Playing
- [ ] Check internet connection (required for gTTS)
- [ ] Try different browser (Chrome recommended)
- [ ] Check browser console for errors (F12)
- [ ] Verify backend is running

#### Audio Generation Fails
- [ ] Check backend console for errors
- [ ] Verify gTTS is installed: `pip show gTTS`
- [ ] Test internet connection
- [ ] Try regenerating

### PDF Upload Issues

#### PDF Not Uploading
- [ ] Check file is valid PDF
- [ ] Try smaller PDF file
- [ ] Check backend console for errors
- [ ] Verify PyPDF2 is installed

#### No Text Extracted
- [ ] PDF might be image-based
- [ ] Install Tesseract OCR for image PDFs
- [ ] Try different PDF file
- [ ] Check if PDF has selectable text

## Performance Optimization

### For Faster Startup
- [ ] Close unnecessary applications
- [ ] Use SSD instead of HDD
- [ ] Increase available RAM
- [ ] Update Python and Node.js to latest versions

### For Better Performance
- [ ] Use smaller PDF files
- [ ] Clear browser cache regularly
- [ ] Close unused browser tabs
- [ ] Restart services periodically

## Security Checklist

- [ ] Running on localhost only (not exposed to internet)
- [ ] No sensitive data in uploaded files
- [ ] Backend CORS configured correctly
- [ ] Using latest dependency versions
- [ ] No API keys exposed in code

## Final Verification

- [ ] All features working correctly
- [ ] No error messages in consoles
- [ ] Audio plays successfully
- [ ] PDF upload works
- [ ] Wikipedia search works
- [ ] Navigation works smoothly
- [ ] Interface looks correct
- [ ] Responsive on different screen sizes

## Success Criteria

✅ Backend starts without errors
✅ Frontend loads correctly
✅ Can upload and summarize PDFs
✅ Can paste and summarize text
✅ Audio overview generates and plays
✅ Wikipedia search returns results
✅ All navigation works
✅ No console errors

## Getting Help

If you encounter issues:

1. **Check Documentation**
   - README.md
   - QUICKSTART.md
   - PROJECT_SUMMARY.md

2. **Check Console Logs**
   - Backend console (CMD window)
   - Browser console (F12)
   - Look for specific error messages

3. **Common Solutions**
   - Restart both servers
   - Clear browser cache
   - Reinstall dependencies
   - Check internet connection
   - Verify Python/Node versions

4. **Contact Developer**
   - GitHub: @Varun251005
   - Instagram: @varunnn.r

---

## Installation Complete! 🎉

If all checkboxes are marked, your Mini NotebookLM installation is successful!

Enjoy using the application! 📓✨
