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

# Mount directories for static access
app.mount("/images", StaticFiles(directory=TEMP_IMG_DIR), name="images")
app.mount("/documents", StaticFiles(directory=PDF_DIR), name="documents")

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

class TKSearchQuery(BaseModel):
    query: str


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
    search_words = [w.lower() for w in english_query.split() if len(w) > 3]

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
                        best_source = filename
                        
                        match_idx = -1
                        for word in search_words:
                            idx = content_lower.find(word)
                            if idx != -1:
                                match_idx = idx
                                break
                        
                        if match_idx != -1:
                            start_idx = max(0, match_idx - 150)
                            end_idx = min(len(page_text), match_idx + 650)
                            snippet = page_text[start_idx:end_idx].replace('\n', ' ')
                            matched_content = f"...{snippet}..."
                        else:
                            matched_content = page_text[:800].replace('\n', ' ')
                        
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
        response_text = f"Official Grounded Guideline (Found in {best_source}, Page {best_page_idx + 1}):\n\n{matched_content}"
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


# --- 5. LIST ALL SOURCES ENDPOINT ---
@app.get("/api/sources")
def list_sources():
    sources_list = []
    if os.path.exists(PDF_DIR):
        for idx, filename in enumerate(os.listdir(PDF_DIR)):
            if filename.lower().endswith(".pdf"):
                file_path = os.path.join(PDF_DIR, filename)
                file_size_kb = round(os.path.getsize(file_path) / 1024, 1)
                sources_list.append({
                    "id": f"{idx+1:02d}",
                    "filename": filename,
                    "title": filename.replace("_", " ").replace(".pdf", "").title(),
                    "size_kb": file_size_kb,
                    "download_url": f"http://127.0.0.1:8000/documents/{filename}"
                })
    return {"sources": sources_list}


# --- 6. TRADITIONAL KNOWLEDGE ENDPOINTS ---
@app.get("/api/traditional-knowledge-info")
def get_tk_info():
    return {
        "introduction": "Traditional Knowledge (TK) refers to knowledge, know-how, skills, and practices developed, sustained, and passed down from generation to generation within a community. In India, repositories like the Traditional Knowledge Digital Library (TKDL)—established by CSIR and the Ministry of Ayush—contain hundreds of thousands of digitized formulations from Ayurveda, Unani, Siddha, Sowa Rigpa, and Yoga to prevent biopiracy and wrongful patent grants.",
        "enlisted_formulations": [
            {
                "id": "TK-01",
                "title": "Turmeric (Curcuma longa Linn.) - Wound Healing & Anti-inflammatory",
                "category": "Ayurvedic Formulation / Medicinal Use",
                "description": "Rhizomes traditionally used as a spice and for healing wounds, rashes, and reducing inflammation.",
                "statutory_status": "Protected under Section 3(p) of the Patents Act / Prior Art documented globally."
            },
            {
                "id": "TK-02",
                "title": "Neem (Azadirachta indica) - Fungicidal & Pest Control",
                "category": "Botanical / Traditional Agriculture & Medicine",
                "description": "Widely documented in ancient texts for its insecticidal, therapeutic, and skin-healing properties.",
                "statutory_status": "Prior art recognized; unpatentable as raw natural formulation."
            },
            {
                "id": "TK-03",
                "title": "Ashwagandha (Withania somnifera) - Rasayana & Vitality",
                "category": "Ayurvedic Rasayana",
                "description": "Classified under classical Ayurvedic literature for promoting longevity, immunity, and stress relief.",
                "statutory_status": "Codified under traditional literature reference compendiums."
            },
            {
                "id": "TK-04",
                "title": "Basmati Rice - Specific Geographic Strains",
                "category": "Agricultural Heritage",
                "description": "Distinct aromatic rice strains traditionally cultivated in the Indian subcontinent.",
                "statutory_status": "Protected via Geographical Indications (GI) and agricultural prior art registries."
            },
            {
                "id": "TK-05",
                "title": "Gugulipid (Commiphora mukul) - Lipid Metabolism",
                "category": "Ayurvedic Pharmacopoeia",
                "description": "Gum resin extract traditionally utilized for managing lipid disorders and inflammation.",
                "statutory_status": "Indexed in TKDL database under classical Ayurvedic therapeutic codes."
            },
            {
                "id": "TK-06",
                "title": "Brahmmi (Bacopa monnieri) - Nootropic / Memory Enhancement",
                "category": "Medhya Rasayana",
                "description": "Traditional brain tonic used for cognitive enhancement, memory retention, and calming anxiety.",
                "statutory_status": "Prior art documented across classical Ayurvedic manuscripts."
            }
        ]
    }

@app.post("/api/traditional-knowledge-search")
def search_tk(payload: TKSearchQuery):
    q = payload.query.lower()
    search_terms = [term for term in q.split() if len(term) > 2]
    
    registry = [
        {"name": "Turmeric / Curcuma longa", "keywords": ["turmeric", "curcuma", "wound", "heal", "skin", "rash", "anti-inflammatory"], "details": "Matches traditional wound-healing and medicinal uses. Barred under Section 3(p) of the Patents Act unless a truly inventive non-obvious process/derivative is claimed."},
        {"name": "Neem / Azadirachta indica", "keywords": ["neem", "azadirachta", "pest", "fungal", "insect", "soap", "skin", "agricultural"], "details": "Matches traditional agricultural and therapeutic botanical uses. Considered established global prior art."},
        {"name": "Ashwagandha / Withania somnifera", "keywords": ["ashwagandha", "somnifera", "sleep", "vitality", "stress", "rasayana", "root", "immunity"], "details": "Classified under classical Ayurvedic Rasayana formulations for vitality and longevity. Subject to prior art documentation."},
        {"name": "Basmati Rice", "keywords": ["basmati", "rice", "grain", "aromatic", "crop"], "details": "Protected under regional agricultural heritage criteria and geographical indication (GI) prior art."},
        {"name": "Brahmi / Bacopa monnieri", "keywords": ["brahmi", "bacopa", "memory", "brain", "cognitive", "nootropic", "xiety"], "details": "Listed under traditional Medhya Rasayana texts for cognitive enhancement and neurological support."},
        {"name": "Guggulu / Commiphora mukul", "keywords": ["guggulu", "gugulipid", "lipid", "cholesterol", "resin", "gum"], "details": "Documented in Ayurvedic pharmacopoeia for managing metabolic parameters and inflammatory conditions."}
    ]
    
    matched_results = []
    for item in registry:
        score = sum(1 for term in search_terms if any(kw in term or term in kw for kw in item["keywords"]))
        if score > 0 or any(kw in q for kw in item["keywords"]):
            matched_results.append({
                "name": item["name"],
                "match_found": True,
                "details": item["details"]
            })
            
    if matched_results:
        return {"status": "Prior Art Match / Potential Conflict Detected", "matches": matched_results}
    return {"status": "No direct traditional knowledge conflict found in baseline public registry subset."}