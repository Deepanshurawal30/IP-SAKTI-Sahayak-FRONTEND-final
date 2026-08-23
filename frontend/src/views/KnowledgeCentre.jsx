import { Search } from 'lucide-react';
import { CheckCircle2, Clock } from 'lucide-react';
import { MOCK } from '../data/mockData';

const JURISDICTIONS = ['India', 'International'];
const DOMAINS = ['Patents', 'Ayurveda', 'Biodiversity', 'ABS', 'Drug Regulation', 'Traditional Knowledge'];
const DOC_TYPES = ['Act', 'Rule', 'Regulation', 'Treaty'];

export default function KnowledgeCentre({ onOpenDocument }) {
  return (
    <div className="container">
      <div className="section-eyebrow">
        <span className="eyebrow">Knowledge Centre</span>
      </div>
      <h2 className="section-title">Knowledge Centre</h2>
      <p className="section-sub">Explore authoritative documents governing Ayurveda, intellectual property, biodiversity and market access.</p>

      <div className="kc-layout">
        <div>
          <FilterBlock title="Jurisdiction" options={JURISDICTIONS} checkedDefault={['India']} />
          <FilterBlock title="Domain" options={DOMAINS} checkedDefault={['Patents', 'Ayurveda']} />
          <FilterBlock title="Document Type" options={DOC_TYPES} checkedDefault={['Act']} />
        </div>
        <div>
          <div className="search-bar">
            <Search size={17} color="#8C8262" />
            <input placeholder="Search Acts, Rules, Regulations, Treaties, Guidelines…" />
          </div>
          <div>
            {MOCK.documents.map((doc) => (
              <button
                key={doc.id}
                type="button"
                className="card doc-card"
                style={{ display: 'block', width: '100%', textAlign: 'left' }}
                onClick={() => onOpenDocument(doc.id)}
              >
                <div className="doc-card-top">
                  <div>
                    <h3>{doc.title}</h3>
                    <div className="doc-meta-row">
                      <span className="pill pill-forest">{doc.jurisdiction}</span>
                      <span className="pill pill-saffron">{doc.domain}</span>
                      <span className="pill" style={{ background: 'var(--ivory-deep)', color: '#6B6350' }}>
                        {doc.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="doc-foot">
                  <span style={{ fontSize: 12, color: '#8C8262' }}>{doc.authority} · Verified {doc.verified}</span>
                  <span className={`indexed${doc.indexed ? '' : ' pending'}`}>
                    {doc.indexed ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                    {doc.indexed ? 'Indexed' : 'Pending index'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterBlock({ title, options, checkedDefault = [] }) {
  return (
    <div className="filter-block">
      <div className="filter-title">{title}</div>
      {options.map((opt) => (
        <label className="filter-opt" key={opt}>
          <input type="checkbox" defaultChecked={checkedDefault.includes(opt)} />
          {opt}
        </label>
      ))}
    </div>
  );
}
