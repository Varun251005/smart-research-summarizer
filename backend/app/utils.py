import io
import os
from typing import Optional
import PyPDF2
import pytesseract
from PIL import Image
from pdf2image import convert_from_bytes
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch
import wikipediaapi
from transformers import pipeline


# Initialize Wikipedia API
wiki_wiki = wikipediaapi.Wikipedia(
    language='en',
    user_agent='SmartResearchSummarizer/1.0'
)

# Initialize summarization model (disabled by default for faster startup)
summarizer = None
print("Using extractive summarization (AI model disabled for performance)")


def extract_text_from_pdf(file_content: bytes) -> str:
    """
    Extract text from PDF file
    """
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")


def perform_ocr(file_content: bytes) -> str:
    """
    Perform OCR on PDF if text extraction fails or returns minimal text
    """
    try:
        images = convert_from_bytes(file_content)
        text = ""
        for image in images:
            text += pytesseract.image_to_string(image) + "\n"
        return text.strip()
    except Exception as e:
        raise Exception(f"Error performing OCR: {str(e)}")


def extract_text_with_fallback(file_content: bytes) -> str:
    """
    Extract text from PDF with OCR fallback
    """
    text = extract_text_from_pdf(file_content)
    
    # If extracted text is too short, try OCR
    if len(text) < 100:
        print("Text extraction returned minimal text, attempting OCR...")
        text = perform_ocr(file_content)
    
    return text


def summarize_text(text: str, max_length: int = 500, min_length: int = 100) -> str:
    """
    Summarize text using BART model or fallback to extractive summarization
    """
    if not text:
        return "No text to summarize"
    
    text = text.strip()
    if len(text) < 50:
        return text
    
    # Try AI-based summarization first
    if summarizer is not None:
        try:
            # Limit input to avoid model limitations
            # BART model has a max input length of 1024 tokens
            words = text.split()
            truncated_text = ' '.join(words[:2000])  # ~max tokens
            
            result = summarizer(truncated_text, max_length=max_length, min_length=min_length, do_sample=False)
            if result and len(result) > 0:
                return result[0]['summary_text']
        except Exception as e:
            print(f"AI summarization failed: {str(e)}, falling back to extractive")
    
    # Fallback to extractive summarization
    sentences = [s.strip() for s in text.split('.') if s.strip()]
    
    if len(sentences) == 0:
        return "No valid sentences found."
    
    # Quick extractive summary - take first, middle, and last sentences for balance
    summary_sentences = []
    total = len(sentences)
    
    if total <= 5:
        # If short, return all
        return '. '.join(sentences) + '.'
    elif total <= 10:
        # Take first 3 and last 2
        summary_sentences = sentences[:3] + sentences[-2:]
    else:
        # Take first 3, middle 2, last 2
        summary_sentences = sentences[:3] + sentences[total//2:total//2+2] + sentences[-2:]
    
    summary = '. '.join(summary_sentences) + '.'
    
    # Limit to reasonable length
    if len(summary) > 1000:
        words = summary.split()
        summary = ' '.join(words[:150]) + '...'
    
    return summary


def lookup_wikipedia(query: str, sentences: int = 3) -> dict:
    """
    Look up related Wikipedia article
    """
    try:
        page = wiki_wiki.page(query)
        
        if not page.exists():
            return {
                "found": False,
                "message": f"No Wikipedia article found for '{query}'"
            }
        
        # Get summary (first N sentences)
        summary = page.summary.split('. ')
        summary_text = '. '.join(summary[:sentences]) + '.'
        
        return {
            "found": True,
            "title": page.title,
            "summary": summary_text,
            "url": page.fullurl
        }
    except Exception as e:
        return {
            "found": False,
            "message": f"Error looking up Wikipedia: {str(e)}"
        }


def generate_pdf(title: str, original_text: str, summary: str, wikipedia_info: Optional[dict] = None) -> bytes:
    """
    Generate a PDF report with the summary
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor='darkblue',
        spaceAfter=30
    )
    story.append(Paragraph(title, title_style))
    story.append(Spacer(1, 0.3 * inch))
    
    # Summary Section
    story.append(Paragraph("Summary", styles['Heading2']))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(summary, styles['BodyText']))
    story.append(Spacer(1, 0.3 * inch))
    
    # Wikipedia Section
    if wikipedia_info and wikipedia_info.get('found'):
        story.append(Paragraph("Related Wikipedia Article", styles['Heading2']))
        story.append(Spacer(1, 0.2 * inch))
        story.append(Paragraph(f"<b>Title:</b> {wikipedia_info['title']}", styles['BodyText']))
        story.append(Spacer(1, 0.1 * inch))
        story.append(Paragraph(wikipedia_info['summary'], styles['BodyText']))
        story.append(Spacer(1, 0.1 * inch))
        story.append(Paragraph(f"<b>URL:</b> <link href='{wikipedia_info['url']}'>{wikipedia_info['url']}</link>", styles['BodyText']))
        story.append(Spacer(1, 0.3 * inch))
    
    # Original Text Section (truncated)
    story.append(Paragraph("Original Text (excerpt)", styles['Heading2']))
    story.append(Spacer(1, 0.2 * inch))
    original_excerpt = original_text[:2000] + "..." if len(original_text) > 2000 else original_text
    story.append(Paragraph(original_excerpt, styles['BodyText']))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
