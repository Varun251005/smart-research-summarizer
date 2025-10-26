from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import io
from typing import Optional
from app.utils import (
    extract_text_with_fallback,
    summarize_text,
    lookup_wikipedia,
    generate_pdf
)

app = FastAPI(title="Smart Research Summarizer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "Smart Research Summarizer API",
        "version": "1.0.0",
        "endpoints": ["/upload", "/summarize-text", "/youtube", "/wikipedia", "/generate-pdf"]
    }


@app.post("/summarize-text")
async def summarize_pasted_text(data: dict):
    """
    Summarize pasted text content
    """
    text = data.get('text', '')
    if not text or len(text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Text is too short to summarize (minimum 50 characters)")
    
    try:
        summary = summarize_text(text)
        return {
            "success": True,
            "summary": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error summarizing text: {str(e)}")


@app.post("/youtube")
async def summarize_youtube(data: dict):
    """
    Extract transcript from YouTube video and summarize it
    """
    url = data.get('url', '')
    if not url:
        raise HTTPException(status_code=400, detail="YouTube URL is required")
    
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        import re
        
        # Extract video ID from URL
        video_id_match = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11}).*', url)
        if not video_id_match:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")
        
        video_id = video_id_match.group(1)
        
        # Get transcript using the correct API (instance-based)
        api = YouTubeTranscriptApi()
        transcript = api.fetch(video_id)
        
        # Extract text from snippets
        transcript_text = ' '.join([snippet.text for snippet in transcript.snippets])
        
        if not transcript_text or len(transcript_text.strip()) < 50:
            raise HTTPException(status_code=400, detail="No transcript available for this video or transcript is too short")
        
        # Summarize transcript
        summary = summarize_text(transcript_text)
        
        return {
            "success": True,
            "video_id": video_id,
            "extracted_text": transcript_text[:5000],
            "full_text_length": len(transcript_text),
            "summary": summary,
            "filename": f"YouTube_{video_id}"
        }
    except ImportError:
        raise HTTPException(status_code=500, detail="YouTube transcript library not installed. Please run: pip install youtube-transcript-api")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing YouTube video: {str(e)}")


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a PDF file and get extracted text and summary
    """
    content = await file.read()
    extracted_text = ""
    
    try:
        # Check if it's a PDF
        is_pdf = (file.content_type == 'application/pdf') or (file.filename and file.filename.lower().endswith('.pdf'))
        
        if not is_pdf:
            raise HTTPException(
                status_code=400, 
                detail=f"Only PDF files are supported. Detected type: {file.content_type}"
            )
        
        # Extract text from PDF
        extracted_text = extract_text_with_fallback(content)
        
        if not extracted_text or len(extracted_text.strip()) < 10:
            raise HTTPException(
                status_code=400, 
                detail="No text could be extracted from the PDF. The file may be empty or contain only images without text."
            )
        
        # Summarize text
        summary = summarize_text(extracted_text)
        
        return {
            "success": True,
            "filename": file.filename or "uploaded-pdf",
            "file_type": "PDF",
            "extracted_text": extracted_text[:5000],
            "full_text_length": len(extracted_text),
            "summary": summary
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


@app.get("/wikipedia")
async def wikipedia_lookup(query: str, sentences: int = 3):
    """
    Look up a topic on Wikipedia
    """
    if not query:
        raise HTTPException(status_code=400, detail="Query parameter is required")
    
    try:
        result = lookup_wikipedia(query, sentences)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error looking up Wikipedia: {str(e)}")


@app.post("/generate-pdf")
async def create_pdf(
    title: str = Form(...),
    original_text: str = Form(...),
    summary: str = Form(...),
    wikipedia_title: Optional[str] = Form(None),
    wikipedia_summary: Optional[str] = Form(None),
    wikipedia_url: Optional[str] = Form(None)
):
    """
    Generate a downloadable PDF with the summary
    """
    try:
        wikipedia_info = None
        if wikipedia_title and wikipedia_summary:
            wikipedia_info = {
                "found": True,
                "title": wikipedia_title,
                "summary": wikipedia_summary,
                "url": wikipedia_url or ""
            }
        
        pdf_bytes = generate_pdf(title, original_text, summary, wikipedia_info)
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={title.replace(' ', '_')}_summary.pdf"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
