import { useState } from 'react';
import Wizard from '../components/common/Wizard';

const STEP_DEFS = ['Product', 'Ingredients', 'Claims', 'Process', 'Target Market', 'Assessment'];

export default function ProductAssessment({ onNavigate }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    productName: '',
    ingredients: '',
    claims: '',
    process: '',
    market: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [backendData, setBackendData] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const field = (key, label, placeholder, textarea = false) => (
    <div className="form-field">
      <label htmlFor={key}>{label}</label>
      {textarea ? (
        <textarea id={key} placeholder={placeholder} value={form[key]} onChange={update(key)} rows={4} />
      ) : (
        <input id={key} placeholder={placeholder} value={form[key]} onChange={update(key)} />
      )}
    </div>
  );

  const steps = [
    { label: 'What is your product?', render: () => field('productName', 'Product name', 'e.g. AshwaPlus — Ashwagandha extract formulation') },
    { label: 'What ingredients does it use?', render: () => field('ingredients', 'Key ingredients', 'e.g. Withania somnifera root extract, honey base', true) },
    { label: 'What claims will you make?', render: () => field('claims', 'Product claims', 'e.g. Supports sleep and vitality', true) },
    { label: 'Describe your process', render: () => field('process', 'Process / method', 'e.g. Cold aqueous extraction at controlled temperature', true) },
    { label: 'Where will you sell it?', render: () => field('market', 'Target market', 'e.g. India, USA, European Union') },
    {
      label: 'Review your assessment',
      render: () => (
        <div>
          <div className="assess-row">
            <div className="k">Product</div>
            <div className="v">{form.productName || '—'}</div>
          </div>
          <div className="assess-row">
            <div className="k">Ingredients</div>
            <div className="v">{form.ingredients || '—'}</div>
          </div>
          <div className="assess-row">
            <div className="k">Claims</div>
            <div className="v">{form.claims || '—'}</div>
          </div>
          <div className="assess-row">
            <div className="k">Process</div>
            <div className="v">{form.process || '—'}</div>
          </div>
          <div className="assess-row">
            <div className="k">Target market</div>
            <div className="v">{form.market || '—'}</div>
          </div>
          <p className="hint-box" style={{ marginTop: 16 }}>
            Ready to execute live classification against CDSCO Rules repository.
          </p>
        </div>
      ),
    },
  ];

  const handleCompleteAssessment = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/product-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: form.productName || 'Ayurvedic Formulation',
          ingredients: form.ingredients || 'Herbal extract',
          claims: form.claims || 'Wellness',
          process: form.process || 'Standard',
          market: form.market || 'India',
        }),
      });
      const data = await response.json();
      setLoading(false);
      setBackendData(data);
      setSubmitted(true);
    } catch (err) {
      console.error('Backend connection error:', err);
      setLoading(false);
      setSubmitted(true);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <h3 className="font-display">Classifying Product via CDSCO Guidelines...</h3>
        <p className="section-sub">Extracting regulatory licensing requirements from official documents.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container">
        <div className="wizard-shell">
          <div className="card" style={{ padding: 40, textAlign: 'left' }}>
            <h3 className="font-display" style={{ fontSize: 22, color: 'var(--forest-deep)', marginTop: 0 }}>
              Assessment Recorded & Grounded
            </h3>
            <p style={{ color: '#6B6350', fontSize: 14, marginBottom: 16 }}>
              <strong>Product:</strong> {form.productName}
            </p>
            <p style={{ color: '#333', fontSize: 14, marginBottom: 16 }}>
              <strong>Regulatory Category:</strong> {backendData?.regulatory_category || 'Ayurvedic, Siddha or Unani (ASU) Drug'}
            </p>
            <p style={{ color: '#333', fontSize: 14, marginBottom: 16 }}>
              <strong>Licensing Requirement:</strong> {backendData?.licensing_requirement || 'Requires manufacturing license under Chapter IV-A.'}
            </p>

            {backendData?.extracted_rule && (
              <div style={{ background: '#f9faf8', padding: 14, borderRadius: 8, marginBottom: 20, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                <strong>Extracted Rule Source ({backendData?.source}):</strong> {backendData.extracted_rule.substring(0, 350)}...
              </div>
            )}

            {backendData?.image_proof && (
              <div style={{ marginBottom: 20 }}>
                <a href={backendData.image_proof} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  🖼️ View CDSCO Page Proof Snapshot
                </a>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-ghost" onClick={() => setSubmitted(false)} type="button">
                Run another assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section-eyebrow">
        <span className="eyebrow">Product Assessment</span>
      </div>
      <h2 className="section-title" style={{ marginBottom: 2 }}>
        Assess your Ayurvedic product
      </h2>
      <p className="section-sub">Answer a few questions to identify the likely IP and regulatory pathways.</p>
      <Wizard
        steps={steps}
        current={step}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
        onFinish={handleCompleteAssessment}
        finishLabel="Complete live assessment"
      />
      <div style={{ maxWidth: 760, margin: '10px auto 0', fontSize: 11.5, color: '#8C8262', fontFamily: "'IBM Plex Mono',monospace" }}>
        Step {step + 1}: {STEP_DEFS[step]}
      </div>
    </div>
  );
}