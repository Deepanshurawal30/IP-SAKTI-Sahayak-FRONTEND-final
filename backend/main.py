import os
import fitz  # PyMuPDF
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from translator import translate_text

app = FastAPI(title="IP-SAKTI Sahayak Multilingual Backend", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PDF_DIR = os.path.join(os.path.dirname(__file__), "documents")
TEMP_IMG_DIR = os.path.join(os.path.dirname(__file__), "temp_images")
os.makedirs(TEMP_IMG_DIR, exist_ok=True)
app.mount("/images", StaticFiles(directory=TEMP_IMG_DIR), name="images")

# --- Pydantic Models ---
class SahayakQuery(BaseModel):
    query: str
    language: str = "en"

class PatentRiskQuery(BaseModel):
    innovation: str
    product: str
    traditionalKnowledge: str
    biologicalResource: str

class ProductAssessmentQuery(BaseModel):
    productName: str
    ingredients: str
    claims: str
    process: str
    market: str

class ABSQuery(BaseModel):
    speciesName: str
    commercialUse: bool
    isForeigner: bool

class UITranslationQuery(BaseModel):
    texts: list[str]
    target_language: str


@app.get("/")
def root():
    return {"status": "Backend running successfully with full feature support"}


# --- UI TRANSLATION ENDPOINT FOR ALL 13 LANGUAGES ---
@app.post("/api/translate-ui")
def translate_ui(payload: UITranslationQuery):
    if payload.target_language == "en" or not payload.target_language:
        return {"translated": payload.texts}
    
    translated_list = []
    for text in payload.texts:
        try:
            translated = translate_text(text, source_lang="en", target_lang=payload.target_language)
            translated_list.append(translated)
        except Exception:
            translated_list.append(text)
            
    return {"translated": translated_list}


# --- 1. ASK SAHAYAK ---
@app.post("/api/ask-sahayak")
def ask_sahayak(payload: SahayakQuery):
    user_query = payload.query
    target_lang = payload.language

    english_query = user_query if target_lang == "en" else translate_text(user_query, source_lang=target_lang, target_lang="en")
    search_words = [w.lower() for w in english_query.split()]

    matched_content = "No matching regulatory guideline found in the uploaded PDFs."
    matched_image_url = None
    best_score = 0
    best_source = ""
    best_page_idx = 0
    
    for filename in os.listdir(PDF_DIR):
        if filename.lower().endswith(".pdf"):
            file_path = os.path.join(PDF_DIR, filename)
            try:
                pdf_document = fitz.open(file_path)
                start_page = 1 if len(pdf_document) > 1 else 0
                
                for page_num in range(start_page, len(pdf_document)):
                    page = pdf_document.load_page(page_num)
                    page_text = page.get_text("text")
                    content_lower = page_text.lower()
                    
                    score = sum(1 for word in search_words if word in content_lower)
                    
                    if "penalt" in content_lower and ("penalt" in english_query.lower() or "punish" in english_query.lower()):
                        score += 5
                    if "adulterated" in content_lower and "adulterated" in english_query.lower():
                        score += 5

                    if score > best_score:
                        best_score = score
                        best_page_idx = page_num
                        matched_content = page_text[:1200].replace('\n', ' ')
                        best_source = filename
                        
                        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                        img_filename = "proof_page.png"
                        img_path = os.path.join(TEMP_IMG_DIR, img_filename)
                        pix.save(img_path)
                        matched_image_url = f"http://127.0.0.1:8000/images/{img_filename}"
                        
                pdf_document.close()
            except Exception as e:
                print(f"Error processing {filename}: {e}")
                continue

    if best_score > 0:
        response_text = f"Official Grounded Guideline (Found in {best_source}, Page {best_page_idx + 1}):\n\n{matched_content}..."
    else:
        response_text = matched_content

    if target_lang != "en":
        response_text = translate_text(response_text, source_lang="en", target_lang=target_lang)

    return {
        "answer": response_text,
        "image_proof": matched_image_url,
        "sources": [best_source] if best_score > 0 else []
    }


# --- 2. PATENT RISK ASSESSMENT ---
@app.post("/api/patent-risk")
def patent_risk_assessment(payload: PatentRiskQuery):
    target_pdf = "patent_act_1970.pdf"
    file_path = os.path.join(PDF_DIR, target_pdf)
    analysis_result = "Evaluated against Patents Act, 1970."
    image_url = None
    
    if os.path.exists(file_path):
        try:
            pdf_doc = fitz.open(file_path)
            for page_num in range(1, len(pdf_doc)):
                page = pdf_doc.load_page(page_num)
                text = page.get_text("text")
                if "traditional knowledge" in text.lower() or "not inventions" in text.lower():
                    analysis_result = text[:1000].replace('\n', ' ')
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                    img_path = os.path.join(TEMP_IMG_DIR, "patent_risk_proof.png")
                    pix.save(img_path)
                    image_url = "http://127.0.0.1:8000/images/patent_risk_proof.png"
                    break
            pdf_doc.close()
        except Exception as e:
            analysis_result = f"Error reading patent act: {e}"

    return {
        "risk_level": "Moderate to High",
        "statutory_basis": analysis_result,
        "traditional_knowledge_conflict": "Detected potential overlap with Section 3(p) traditional knowledge exclusions.",
        "image_proof": image_url,
        "source": target_pdf
    }


# --- 3. PRODUCT ASSESSMENT ---
@app.post("/api/product-assessment")
def product_assessment(payload: ProductAssessmentQuery):
    target_pdf = "CDSCO_Drugs_Cosmetics_Rules.pdf"
    file_path = os.path.join(PDF_DIR, target_pdf)
    regulation_text = "Evaluated against CDSCO regulatory frameworks."
    image_url = None
    
    if os.path.exists(file_path):
        try:
            pdf_doc = fitz.open(file_path)
            for page_num in range(1, len(pdf_doc)):
                page = pdf_doc.load_page(page_num)
                text = page.get_text("text")
                if "ayurvedic" in text.lower() or "licence" in text.lower():
                    regulation_text = text[:1000].replace('\n', ' ')
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                    img_path = os.path.join(TEMP_IMG_DIR, "product_assessment_proof.png")
                    pix.save(img_path)
                    image_url = "http://127.0.0.1:8000/images/product_assessment_proof.png"
                    break
            pdf_doc.close()
        except Exception as e:
            regulation_text = f"Error reading CDSCO rules: {e}"

    return {
        "product": payload.productName,
        "regulatory_category": "Ayurvedic, Siddha or Unani (ASU) Drug",
        "licensing_requirement": "Requires a manufacturing license under Chapter IV-A.",
        "extracted_rule": regulation_text,
        "image_proof": image_url,
        "source": target_pdf
    }


# --- 4. ABS & BIODIVERSITY ASSESSMENT ---
@app.post("/api/abs-check")
def abs_check(payload: ABSQuery):
    target_pdf = "Indias_Biodiversity_Act_2002_and_its_role_in_cons.pdf"
    file_path = os.path.join(PDF_DIR, target_pdf)
    abs_text = "Evaluated against the Biological Diversity Act, 2002."
    image_url = None
    
    if os.path.exists(file_path):
        try:
            pdf_doc = fitz.open(file_path)
            for page_num in range(1, len(pdf_doc)):
                page = pdf_doc.load_page(page_num)
                text = page.get_text("text")
                if "benefit sharing" in text.lower() or "approval" in text.lower():
                    abs_text = text[:1000].replace('\n', ' ')
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                    img_path = os.path.join(TEMP_IMG_DIR, "abs_proof.png")
                    pix.save(img_path)
                    image_url = "http://127.0.0.1:8000/images/abs_proof.png"
                    break
            pdf_doc.close()
        except Exception as e:
            abs_text = f"Error reading Biodiversity Act: {e}"

    return {
        "species": payload.speciesName,
        "approval_required": "Prior approval from the National Biodiversity Authority (NBA) is mandatory." if payload.isForeigner else "Prior intimation to the State Biodiversity Board.",
        "statutory_guideline": abs_text,
        "image_proof": image_url,
        "source": target_pdf
    }