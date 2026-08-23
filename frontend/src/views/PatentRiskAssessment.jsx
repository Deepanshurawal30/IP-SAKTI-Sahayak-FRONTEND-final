import { useState } from 'react';
import Wizard from '../components/common/Wizard';
import PatentRiskResult from '../components/common/PatentRiskResult';
import { SAMPLE_RISK_RESULT } from '../data/mockData';

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

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const steps = FIELDS.map((f) => ({
    label: f.label,
    render: () => (
      <div className="form-field">
        <textarea placeholder={f.placeholder} value={form[f.key]} onChange={update(f.key)} rows={4} />
      </div>
    ),
  }));

  if (result) {
    return (
      <div className="container">
        <div className="section-eyebrow">
          <span className="eyebrow">Patent Risk Assessment</span>
        </div>
        <h2 className="section-title">Preliminary result</h2>
        <p className="section-sub">
          This UI-only preview renders sample values in the exact shape the scoring API will return.
        </p>
        <div className="card" style={{ padding: 32, maxWidth: 720 }}>
          <PatentRiskResult {...result} />
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
      <p className="section-sub">Answer these to generate a preliminary indicator of patent risk, once connected to the scoring engine.</p>
      <Wizard
        steps={steps}
        current={step}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
        onFinish={() => setResult(SAMPLE_RISK_RESULT)}
        finishLabel="See preliminary result"
      />
    </div>
  );
}
