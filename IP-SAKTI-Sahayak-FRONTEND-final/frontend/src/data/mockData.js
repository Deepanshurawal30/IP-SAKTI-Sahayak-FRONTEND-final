/* ============================================================
   STATIC UI REFERENCE DATA
   This file contains placeholder/demo content used only to give
   the frontend components something real to render during visual
   development. It is NOT connected to any backend, model, or
   database. Every value here is clearly a stand-in for data that
   will eventually come from the IP-SAKTI Sahayak API.
   ============================================================ */

export const LANGUAGES = [
  { code: 'en', native: 'English', english: 'English' },
  { code: 'hi', native: 'हिन्दी', english: 'Hindi' },
  { code: 'sa', native: 'संस्कृतम्', english: 'Sanskrit' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil' },
  { code: 'te', native: 'తెలుగు', english: 'Telugu' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada' },
  { code: 'ml', native: 'മലയാളം', english: 'Malayalam' },
  { code: 'bn', native: 'বাংলা', english: 'Bengali' },
  { code: 'mr', native: 'मराठी', english: 'Marathi' },
  { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
  { code: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia' },
  { code: 'as', native: 'অসমীয়া', english: 'Assamese' },
];

export const PATHS = [
  { icon: 'message-circle', title: 'Ask Sahayak', desc: 'Put a question to a source-grounded AI assistant, in plain language.', view: 'chat' },
  { icon: 'clipboard-list', title: 'Assess My Product', desc: 'Walk through a guided assessment of your Ayurvedic product.', view: 'assessment' },
  { icon: 'shield', title: 'Explore IP', desc: 'See which intellectual property instruments may fit your innovation.', view: 'ipnav' },
  { icon: 'scroll-text', title: 'Traditional Knowledge', desc: 'Check how classical Ayurvedic knowledge affects your pathway.', view: 'tk' },
  { icon: 'leaf', title: 'Biodiversity & ABS', desc: 'Understand obligations tied to biological resources.', view: 'abs' },
  { icon: 'library', title: 'Knowledge Centre', desc: 'Browse the underlying Acts, Rules, Regulations and Treaties.', view: 'knowledge' },
];

export const MOCK = {
  sources: [
    { id: 'src-patents-3p', title: 'Patents Act, 1970', section: 'Section 3(p)', domain: 'Intellectual Property', jurisdiction: 'India', authority: 'Official Government Source', version: 'Current', effective: '20 Apr 1972', verified: '22 Aug 2026', type: 'Act' },
    { id: 'src-biodiv', title: 'Biological Diversity framework', section: 'Access provisions', domain: 'Biodiversity', jurisdiction: 'India', authority: 'National Biodiversity Authority', version: 'Current', effective: '—', verified: '22 Aug 2026', type: 'Act / Rule' },
    { id: 'src-trips', title: 'TRIPS Agreement', section: 'Art. 27', domain: 'International IP', jurisdiction: 'International', authority: 'World Trade Organization', version: 'Current', effective: '01 Jan 1995', verified: '22 Aug 2026', type: 'Treaty' },
    { id: 'src-cbd', title: 'Convention on Biological Diversity', section: 'Art. 15', domain: 'Biodiversity', jurisdiction: 'International', authority: 'CBD Secretariat', version: 'Current', effective: '29 Dec 1993', verified: '22 Aug 2026', type: 'Treaty' },
    { id: 'src-fssai', title: 'FSSAI — Ayurveda-Aahar Regulations', section: 'Product classification', domain: 'Food', jurisdiction: 'India', authority: 'FSSAI', version: 'Current', effective: '—', verified: '22 Aug 2026', type: 'Regulation' },
  ],
  documents: [
    { id: 'patents-act-1970', title: 'Patents Act, 1970', jurisdiction: 'India', domain: 'Intellectual Property', type: 'Act', authority: 'IP India / India Code', verified: '22 Aug 2026', indexed: true },
    { id: 'biodiversity-act-2002', title: 'Biological Diversity Act, 2002', jurisdiction: 'India', domain: 'Biodiversity', type: 'Act', authority: 'National Biodiversity Authority', verified: '22 Aug 2026', indexed: true },
    { id: 'ayush-standards', title: 'Ministry of Ayush — Ayurveda Pharmacopoeial Standards', jurisdiction: 'India', domain: 'Ayurveda', type: 'Guideline', authority: 'Ministry of Ayush', verified: '22 Aug 2026', indexed: true },
    { id: 'fssai-aahar', title: 'FSSAI Ayurveda-Aahar Regulations, 2022', jurisdiction: 'India', domain: 'Food', type: 'Regulation', authority: 'FSSAI', verified: '22 Aug 2026', indexed: true },
    { id: 'trips', title: 'TRIPS Agreement', jurisdiction: 'International', domain: 'International IP', type: 'Treaty', authority: 'World Trade Organization', verified: '22 Aug 2026', indexed: true },
    { id: 'nagoya', title: 'Nagoya Protocol on ABS', jurisdiction: 'International', domain: 'Biodiversity', type: 'Treaty', authority: 'CBD Secretariat', verified: '22 Aug 2026', indexed: false },
    { id: 'pct', title: 'Patent Cooperation Treaty (PCT)', jurisdiction: 'International', domain: 'International IP', type: 'Treaty', authority: 'WIPO', verified: '22 Aug 2026', indexed: true },
  ],
  ipTypes: [
    { tag: 'Patent', title: 'Patent', what: 'New inventions / technical processes', when: 'A novel, non-obvious technical process or product with an inventive step over prior art.', qs: 'Is my extraction process patentable? Does TK exclude it?' },
    { tag: 'Trademark', title: 'Trademark', what: 'Brand identity', when: 'Distinctive brand names, logos or packaging that identify your product in the market.', qs: 'Can I trademark my product name? What about a Sanskrit term?' },
    { tag: 'GI', title: 'Geographical Indication', what: 'Geographical origin-linked goods', when: 'A product whose qualities are essentially attributable to a specific geographical origin.', qs: 'Is my formulation linked to a specific region?' },
    { tag: 'Design', title: 'Design', what: 'Visual appearance', when: 'The unique visual/ornamental appearance of an article, such as packaging shape.', qs: 'Can I protect my bottle or packaging design?' },
    { tag: 'Copyright', title: 'Copyright', what: 'Original creative expression', when: 'Literary, artistic or digital works such as labels, brochures or educational content.', qs: 'Are my product inserts or brand content protected?' },
    { tag: 'Trade Secret', title: 'Trade Secret', what: 'Confidential know-how', when: 'Proprietary processes or formulations kept confidential rather than disclosed.', qs: 'Should I patent or keep my process confidential?' },
    { tag: 'TK', title: 'Traditional Knowledge', what: 'Existing community-held knowledge', when: 'Knowledge already documented or practiced traditionally — generally not patentable as new.', qs: 'Does classical Ayurvedic origin block my patent?' },
  ],
  explore: [
    { icon: 'shield-check', title: 'Protect My Innovation', desc: 'Understand which IP instruments may fit your product.', view: 'ipnav' },
    { icon: 'layers', title: 'Classify My Product', desc: 'Medicine, food, cosmetic, or research formulation?', view: 'assessment' },
    { icon: 'scroll-text', title: 'Traditional Knowledge', desc: 'Check how classical knowledge affects your pathway.', view: 'tk' },
    { icon: 'leaf', title: 'Biodiversity & ABS', desc: 'Assess obligations tied to biological resources.', view: 'abs' },
    { icon: 'gavel', title: 'Regulatory Guidance', desc: 'Drug, food, cosmetic and advertising requirements.', view: 'knowledge' },
    { icon: 'globe', title: 'International Protection', desc: 'See how jurisdiction changes your pathway.', view: 'ipnav' },
  ],
  tkResults: [
    { title: 'Ashwagandha (Withania somnifera) — traditional use for sleep & vitality', source: 'Public compendium reference (DEMO)', note: 'Referenced across classical Ayurvedic texts and public traditional-knowledge compilations.' },
    { title: 'Withania somnifera root preparations — Rasayana category', source: 'Public compendium reference (DEMO)', note: 'Classified under Rasayana (rejuvenative) formulations in classical literature.' },
  ],
};

export const REASONING_STEPS = ['Understand', 'Classify', 'Jurisdiction', 'IP Domain', 'Retrieve', 'Reason', 'Answer', 'Cite', 'Confidence', 'Next Step'];

export const READER_DOCS = {
  'patents-act-1970': {
    title: 'Patents Act, 1970',
    toc: [
      { chapter: 'Chapter I', items: [{ id: 'preliminary', label: 'Preliminary' }] },
      { chapter: 'Chapter II', items: [{ id: 'sec-3', label: 'Section 3 — What are not inventions' }, { id: 'sec-3p', label: 'Section 3(p) — Traditional knowledge' }] },
    ],
    content: {
      preliminary: 'This Act may be called the Patents Act, 1970. It extends to the whole of India and governs the grant and regulation of patents.',
      'sec-3': 'Section 3 sets out categories of subject matter that are not regarded as inventions within the meaning of this Act, including certain discoveries, methods of agriculture or horticulture, and traditional knowledge as described in clause (p).',
      'sec-3p': { highlight: 'Section 3(p) — The following is not an invention: an invention which, in effect, is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components.', body: 'This provision is central to assessing whether an Ayurvedic formulation is patentable — a formulation that is essentially the same as a traditionally known preparation is unlikely to satisfy the novelty and inventive-step requirements.' },
    },
    defaultSection: 'sec-3p',
  },
  'biodiversity-act-2002': {
    title: 'Biological Diversity Act, 2002',
    toc: [
      { chapter: 'Chapter I', items: [{ id: 'preliminary', label: 'Preliminary' }] },
      { chapter: 'Chapter III', items: [{ id: 'access', label: 'Regulation of Access' }] },
    ],
    content: {
      preliminary: 'An Act to provide for conservation of biological diversity, sustainable use of its components and fair and equitable sharing of the benefits arising out of the use of biological resources and knowledge.',
      access: { highlight: 'Access provisions — Persons seeking to access biological resources occurring in India, or associated traditional knowledge, for research or commercial utilisation may be required to obtain prior approval and enter into benefit-sharing arrangements.', body: 'This is potentially relevant for Ayurvedic product developers using Indian biological resources — including for extraction processes derived from Indian medicinal plants.' },
    },
    defaultSection: 'access',
  },
};

export function docIdForSource(s) {
  if (s.title.includes('Patents')) return 'patents-act-1970';
  if (s.title.includes('Biological')) return 'biodiversity-act-2002';
  return 'patents-act-1970';
}

/* Demo assessment used to populate "My Assessments" and the Report view. */
export const DEMO_ASSESSMENT = {
  title: 'AshwaPlus',
  updated: '22 Aug 2026',
  jurisdictions: 'India + USA',
  status: 'Review required',
  rows: [
    { label: 'Patent', tone: 'warn', text: 'review required' },
    { label: 'ABS', tone: 'warn', text: 'potentially relevant' },
    { label: 'Regulatory', tone: 'dim', text: 'classification pending' },
  ],
};

/* Reusable shape for a future PatentRiskResult API payload. Sample values
   only — the component itself accepts { score, riskLevel, factors } as props. */
export const SAMPLE_RISK_RESULT = {
  score: 68,
  riskLevel: 'HIGH',
  factors: [
    { label: 'Novelty Risk', value: 72, tone: 'low' },
    { label: 'Inventive Step', value: 58, tone: 'warn' },
    { label: 'Traditional Knowledge Overlap', value: 81, tone: 'low' },
    { label: 'Prior Art Density', value: 64, tone: 'warn' },
    { label: 'Section 3(p) Exclusion Risk', value: 70, tone: 'low' },
    { label: 'Information Completeness', value: 45, tone: 'ok' },
  ],
};
