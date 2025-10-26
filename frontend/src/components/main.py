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
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "Smart Research Summarizer API",
        "version": "1.0.0",
        "endpoints": ["/upload", "/summarize-text", "/wikipedia", "/generate-pdf"]
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


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a PDF or image file and get extracted text and summary
    """
    content = await file.read()
    extracted_text = ""
    file_type = "unknown"
    
    try:
        # Check content type first (more reliable), then filename as fallback
        is_pdf = (file.content_type == 'application/pdf') or (file.filename and file.filename.lower().endswith('.pdf'))
        is_image = (file.content_type and file.content_type.startswith('image/')) or \
                   (file.filename and any(file.filename.lower().endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff']))
        
        # Process PDF
        if is_pdf:
            file_type = "PDF"
            extracted_text = extract_text_with_fallback(content)
        
        # Process Image
        elif is_image:
            file_type = "Image"
            try:
                from PIL import Image
                import pytesseract
                import io
                
                # Perform OCR on the image
                image = Image.open(io.BytesIO(content))
                extracted_text = pytesseract.image_to_string(image)
                
                if not extracted_text.strip():
                    raise HTTPException(status_code=400, detail="No text found in image. Please make sure the image contains readable text.")
            except ImportError:
                raise HTTPException(
                    status_code=500, 
                    detail="OCR libraries not available. Please install Pillow and pytesseract."
                )
            except Exception as e:
                # Check if it's a Tesseract error
                if 'tesseract' in str(e).lower():
                    raise HTTPException(
                        status_code=500, 
                        detail=f"Tesseract OCR is not installed. Please install it from: https://github.com/UB-Mannheim/tesseract/wiki. Error: {str(e)}"
                    )
                raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
        
        else:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Only PDF and image files are supported. Detected type: {file.content_type}, filename: {file.filename}"
            )
        
        if not extracted_text or len(extracted_text.strip()) < 10:
            raise HTTPException(
                status_code=400, 
                detail=f"No text could be extracted from the {file_type}. The file may be empty or contain only images without text."
            )
        
        # Summarize text
        summary = summarize_text(extracted_text)
        
        return {
            "success": True,
            "filename": file.filename or f"uploaded-{file_type.lower()}",
            "file_type": file_type,
            "extracted_text": extracted_text[:5000],
            "full_text_length": len(extracted_text),
            "summary": summary
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


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
