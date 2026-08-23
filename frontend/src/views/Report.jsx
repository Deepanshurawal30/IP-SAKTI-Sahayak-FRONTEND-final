import { Download } from 'lucide-react';
import SourceCard from '../components/common/SourceCard';
import { MOCK, docIdForSource } from '../data/mockData';

const SECTIONS = [
  {
    title: 'Executive Summary',
    body: 'AshwaPlus is a new Ashwagandha extraction process. Based on information provided, it may qualify as a proprietary / new formulation, but patentability and biodiversity obligations require further verification.',
  },
  { title: 'Product Classification', body: 'Potentially Proprietary / New Formulation.' },
  { title: 'IP Opportunities', body: 'Patent (subject to novelty assessment); Trade Secret as an alternative to disclosure.' },
  { title: 'Traditional Knowledge Considerations', body: 'Section 3(p) exclusions may apply if the extraction process mirrors known traditional methods.' },
  { title: 'Biodiversity / ABS', body: 'Potentially relevant given use of an Indian medicinal plant.' },
  { title: 'Applicable Rules', body: 'India requirements: classification under Ayurvedic Medicine or Ayurveda-Aahar to be confirmed; drug/food regulatory review required.' },
  { title: 'Compliance Gaps', body: 'Formulation classification and biodiversity-obligation status are not yet confirmed.' },
  { title: 'International Considerations', body: 'Export to the USA and EU introduces separate regulatory and IP regimes — review destination-specific rules.' },
];

const NEXT_STEPS = ['Confirm formulation classification', 'Review prior art', 'Assess biodiversity obligations', 'Conduct patentability search', 'Consult an IP professional'];

export default function Report({ onOpenDocument }) {
  return (
    <div className="container">
      <div className="section-eyebrow">
        <span className="eyebrow">Assessment Report</span>
      </div>
      <h2 className="section-title">AshwaPlus — Assessment Report</h2>

      <div className="card" style={{ padding: 30, maxWidth: 800 }}>
        {SECTIONS.map((s) => (
          <div key={s.title} style={{ marginBottom: 4 }}>
            <h3 style={{ marginTop: 0 }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: '#4A4536', lineHeight: 1.7 }}>{s.body}</p>
          </div>
        ))}

        <h3>Recommended Next Steps</h3>
        <ol className="ns-list">
          {NEXT_STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>

        <h3>Sources</h3>
        {MOCK.sources.slice(0, 3).map((s, i) => (
          <SourceCard key={s.id} source={s} index={i} onClick={() => onOpenDocument(docIdForSource(s))} />
        ))}

        <h3>Disclaimer</h3>
        <p style={{ fontSize: 12.5, color: '#8C8262' }}>This report provides information and source-based guidance, not legal advice.</p>

        <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()} type="button">
            <Download size={14} />
            Download / Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
