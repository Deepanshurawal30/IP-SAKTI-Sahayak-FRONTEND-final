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
            This is a UI-only preview. Submitting will not run a real assessment until the
            backend classification engine is connected.
          </p>
        </div>
      ),
    },
  ];

  if (submitted) {
    return (
      <div className="container">
        <div className="wizard-shell">
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <h3 className="font-display" style={{ fontSize: 22, color: 'var(--forest-deep)', marginTop: 0 }}>
              Assessment recorded
            </h3>
            <p style={{ color: '#6B6350', fontSize: 14, maxWidth: 420, margin: '0 auto 22px' }}>
              This is placeholder confirmation for the visual flow — once the backend is connected,
              this step will trigger real classification and populate your report.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => onNavigate('report')} type="button">
                View sample report
              </button>
              <button className="btn btn-ghost" onClick={() => onNavigate('assessments')} type="button">
                My Assessments
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
        onFinish={() => setSubmitted(true)}
        finishLabel="Complete assessment"
      />
      <div style={{ maxWidth: 760, margin: '10px auto 0', fontSize: 11.5, color: '#8C8262', fontFamily: "'IBM Plex Mono',monospace" }}>
        Step {step + 1}: {STEP_DEFS[step]}
      </div>
    </div>
  );
}
