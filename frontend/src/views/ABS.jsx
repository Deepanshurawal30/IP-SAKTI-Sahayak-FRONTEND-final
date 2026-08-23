import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SourceCard from '../components/common/SourceCard';
import { MOCK, docIdForSource } from '../data/mockData';

const OPTIONS = [
  { key: 'yes', label: 'Yes' },
  { key: 'no', label: 'No' },
  { key: 'unsure', label: 'Not sure' },
];

const PATHWAY = ['Biological Resource', 'Access', 'Research / Commercial Use', 'IP / Product Development', 'Compliance Assessment'];

export default function ABS({ onNavigate }) {
  const [answer, setAnswer] = useState(null);

  return (
    <div className="container">
      <div className="section-eyebrow">
        <span className="eyebrow">Access &amp; Benefit Sharing</span>
      </div>
      <h2 className="section-title">Access &amp; Benefit Sharing</h2>
      <p className="section-sub">
        If your innovation uses biological resources or associated traditional knowledge, biodiversity obligations may become relevant.
      </p>

      <div className="card" style={{ padding: 28, maxWidth: 520 }}>
        <div style={{ fontWeight: 600, marginBottom: 14 }}>Does your product involve biological resources obtained from India?</div>
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            type="button"
            className={`opt-btn${answer === o.key ? ' selected' : ''}`}
            onClick={() => setAnswer(o.key)}
          >
            <span>{o.label}</span>
            <span className="chk">{answer === o.key && '✓'}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginTop: 32 }}
          >
            <h3 style={{ fontSize: 17 }}>Likely pathway</h3>
            <div className="pathway">
              {PATHWAY.map((step, i) => (
                <div key={step} style={{ display: 'contents' }}>
                  <div className="pw-step" style={i === PATHWAY.length - 1 ? { borderColor: 'var(--saffron)', color: 'var(--warn)' } : undefined}>
                    {step}
                  </div>
                  {i < PATHWAY.length - 1 && <div className="pw-arrow">↓</div>}
                </div>
              ))}
            </div>
            <div className="grid grid-2" style={{ marginTop: 20 }}>
              <div className="card" style={{ padding: 20 }}>
                <h4 style={{ margin: '0 0 8px', fontSize: 14.5 }}>Potentially relevant areas</h4>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: '#4A4536', lineHeight: 1.8 }}>
                  <li>Biological resource access</li>
                  <li>Associated traditional knowledge</li>
                  <li>IPR implications</li>
                  <li>Benefit sharing</li>
                  <li>Documentation</li>
                </ul>
              </div>
              <div className="card" style={{ padding: 20 }}>
                <h4 style={{ margin: '0 0 8px', fontSize: 14.5 }}>Sources</h4>
                {MOCK.sources
                  .filter((s) => s.domain === 'Biodiversity')
                  .map((s, i) => (
                    <SourceCard key={s.id} source={s} index={i} onClick={() => onNavigate('reader', docIdForSource(s))} />
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button className="btn btn-secondary" style={{ marginTop: 20 }} onClick={() => onNavigate('chat')} type="button">
        Ask Sahayak about this
      </button>
    </div>
  );
}
