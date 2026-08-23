import { useState } from 'react';
import Wizard from '../components/common/Wizard';
import PatentRiskResult from '../components/common/PatentRiskResult';

const FIELDS = [
  { key: 'innovation', label: 'Describe your innovation', placeholder: 'What have you developed?' },
  { key: 'product', label: 'What is the product?', placeholder: 'e.g. Ashwagandha-based sleep supplement' },
  { key: 'technicalProblem', label: 'What technical problem does it solve?', placeholder: 'e.g. Low bioavailability of the active compound' },
  { key: 'technicalSolution', label: 'What is your technical solution?', placeholder: 'e.g. A novel extraction and stabilisation method' },
  { key: 'technicalNovelty', label: 'What makes it technically novel?', placeholder: 'What is different from existing methods?' },
  { key: 'traditionalKnowledge', label: 'Any traditional knowledge basis?', placeholder: 'e.g. Rooted in classical Rasayana preparation' },
  { key: 'biologicalResource', label: 'Biological resource used?', placeholder: 'e.g. Withania somnifera sourced in India' },
  { key: 'priorArt', label: 'Known prior art?', placeholder: 'Any similar patents or publications you know of' },
  { key: 'jurisdiction', label: 'Target jurisdiction', placeholder: 'e.g. India, USA, EU' },
];

export default function PatentRiskAssessment() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(Object.fromEntries(FIELDS.map((f) => [f.key, ''])));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const steps = FIELDS.map((f) => ({
    label: f.label,
    render: () => (
      <div className="form-field">
        <textarea placeholder={f.placeholder} value={form[f.key]} onChange={update(f.key)} rows={4} />
      </div>
    ),
  }));

  const handleFinish = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/patent-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          innovation: form.innovation || 'Ayurvedic formulation',
          product: form.product || 'Extract',
          traditionalKnowledge: form.traditionalKnowledge || 'Classical reference',
          biologicalResource: form.biologicalResource || 'Indian Flora',
        }),
      });
      const data = await response.json();
      setLoading(false);

      // Map backend response into the result view format
      setResult({
        score: 68,
        level: data.risk_level || 'Moderate to High',
        summary: data.traditional_knowledge_conflict,
        statutoryBasis: data.statutory_basis,
        imageProof: data.image_proof,
        source: data.source,
      });
    } catch (err) {
      console.error('Backend error:', err);
      setLoading(false);
      // Fallback result if offline
      setResult({
        score: 50,
        level: 'Moderate',
        summary: 'Error connecting to backend assessment engine.',
        statutoryBasis: 'Please check your local FastAPI connection.',
      });
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <h3 className="font-display">Analyzing Patent Act & Prior Art...</h3>
        <p className="section-sub">Scanning official government guidelines for statutory compliance.</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="container">
        <div className="section-eyebrow">
          <span className="eyebrow">Patent Risk Assessment</span>
        </div>
        <h2 className="section-title">Live Backend Assessment Result</h2>
        <p className="section-sub">
          Evaluated dynamically against the Patents Act, 1970 repository.
        </p>
        <div className="card" style={{ padding: 32, maxWidth: 720 }}>
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ color: 'var(--forest-deep)' }}>Risk Level: {result.level}</h4>
            <p style={{ fontSize: 14, color: '#444' }}>{result.summary}</p>
          </div>
          <div style={{ marginBottom: 16, background: '#f9faf8', padding: 16, borderRadius: 8 }}>
            <h5 style={{ margin: '0 0 8px 0', fontSize: 13, textTransform: 'uppercase', color: '#6B6350' }}>Grounded Statutory Basis ({result.source}):</h5>
            <p style={{ fontSize: 13, lineHeight: 1.5, fontFamily: "'IBM Plex Mono', monospace" }}>{result.statutory_basis}</p>
          </div>
          {result.imageProof && (
            <div style={{ marginTop: 16 }}>
              <a href={result.imageProof} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                🖼️ View Official Page Proof Snapshot
              </a>
            </div>
          )}
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 20 }} onClick={() => setResult(null)} type="button">
          Start a new assessment
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section-eyebrow">
        <span className="eyebrow">Patent Risk Assessment</span>
      </div>
      <h2 className="section-title" style={{ marginBottom: 2 }}>
        Preliminary Patent Risk Assessment
      </h2>
      <p className="section-sub">Answer these to generate a live indicator of patent risk from your Python backend.</p>
      <Wizard
        steps={steps}
        current={step}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
        onFinish={handleFinish}
        finishLabel="Run live backend assessment"
      />
    </div>
  );
}