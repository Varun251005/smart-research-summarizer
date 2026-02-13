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
from gtts import gTTS


# Initialize Wikipedia API
wiki_wiki = wikipediaapi.Wikipedia(
    language='en',
    user_agent='MiniNotebookLM/2.0'
)


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
    Summarize text using improved extractive summarization
    """
    if not text:
        return "No text to summarize"
    
    text = text.strip()
    if len(text) < 50:
        return text
    
    # Split into sentences
    sentences = [s.strip() for s in text.replace('\n', ' ').split('.') if s.strip() and len(s.strip()) > 10]
    
    if len(sentences) == 0:
        return "No valid sentences found."
    
    # Calculate sentence importance based on position and length
    important_sentences = []
    total = len(sentences)
    
    if total <= 3:
        return '. '.join(sentences) + '.'
    
    # Take first sentence (usually contains main topic)
    important_sentences.append(sentences[0])
    
    # Take sentences from middle (core content)
    if total > 5:
        mid_start = total // 3
        mid_end = (2 * total) // 3
        important_sentences.extend(sentences[mid_start:mid_start + 2])
    
    # Take last sentence (often contains conclusion)
    if total > 2:
        important_sentences.append(sentences[-1])
    
    summary = '. '.join(important_sentences) + '.'
    
    # Limit to reasonable length
    if len(summary) > 800:
        words = summary.split()
        summary = ' '.join(words[:120]) + '...'
    
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


def generate_audio_overview(summary: str) -> bytes:
    """
    Generate audio overview from summary using text-to-speech
    """
    try:
        # Create introduction
        intro = "Here's your audio overview. "
        full_text = intro + summary
        
        # Generate audio
        tts = gTTS(text=full_text, lang='en', slow=False)
        
        # Save to bytes buffer
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        
        return audio_buffer.getvalue()
    except Exception as e:
        raise Exception(f"Error generating audio: {str(e)}")
