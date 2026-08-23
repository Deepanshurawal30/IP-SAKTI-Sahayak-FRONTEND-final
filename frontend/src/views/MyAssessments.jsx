import { DEMO_ASSESSMENT } from '../data/mockData';

export default function MyAssessments({ onNavigate }) {
  const a = DEMO_ASSESSMENT;
  return (
    <div className="container">
      <div className="section-eyebrow">
        <span className="eyebrow">My Assessments</span>
      </div>
      <h2 className="section-title">My Assessments</h2>

      <div className="card" style={{ padding: 22, maxWidth: 640 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: 17 }}>{a.title}</h3>
            <div style={{ fontSize: 12.5, color: '#8C8262' }}>
              Updated {a.updated} · {a.jurisdictions}
            </div>
          </div>
          <span className="pill pill-saffron">{a.status}</span>
        </div>

        <div style={{ marginTop: 16 }}>
          {a.rows.map((r) => (
            <div className="conf-row" key={r.label}>
              <span
                className="conf-dot"
                style={{ background: r.tone === 'warn' ? 'var(--warn)' : r.tone === 'dim' ? '#9c927a' : 'var(--ok)' }}
              />
              {r.label} — {r.text}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('assessment')} type="button">
            Continue
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('report')} type="button">
            View report
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('chat')} type="button">
            Ask Sahayak
          </button>
        </div>
      </div>
    </div>
  );
}
