import { useState } from 'react';
import { Search, ScrollText } from 'lucide-react';
import { MOCK } from '../data/mockData';
import { SourceLoading, EmptyState } from '../components/common/States';

const STEPS = ['Traditional\nKnowledge', 'Structured\nknowledge', 'Prior-art\nvisibility', 'Patent examination\nsupport'];

export default function TraditionalKnowledge({ onNavigate }) {
  const [query, setQuery] = useState('Ashwagandha sleep-related traditional use');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(MOCK.tkResults);

  const search = () => {
    setLoading(true);
    window.setTimeout(() => {
      setResults(MOCK.tkResults);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="container">
      <div className="section-eyebrow">
        <span className="eyebrow">Traditional Knowledge</span>
      </div>
      <h2 className="section-title">Traditional Knowledge &amp; prior art</h2>
      <p className="section-sub">
        Traditional knowledge can affect patentability and prior-art analysis. Search public, demo-labelled information below.
      </p>

      <div className="search-bar">
        <Search size={17} color="#8C8262" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. Ashwagandha sleep-related traditional use" />
        <button className="btn btn-primary btn-sm" onClick={search} type="button">
          Search
        </button>
      </div>

      {loading ? (
        <SourceLoading rows={2} />
      ) : results.length === 0 ? (
        <EmptyState icon={ScrollText} title="No results" description="Try a different search term." />
      ) : (
        <div>
          {results.map((r) => (
            <div className="card" key={r.title} style={{ padding: 18, marginBottom: 12 }}>
              <h4 style={{ margin: '0 0 6px', fontSize: 15 }}>{r.title}</h4>
              <div style={{ fontSize: 12, color: '#8C8262', marginBottom: 8 }}>{r.source}</div>
              <p style={{ margin: 0, fontSize: 13.5, color: '#4A4536', lineHeight: 1.6 }}>{r.note}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ padding: 24, marginTop: 28 }}>
        <div className="rpath" style={{ justifyContent: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'contents' }}>
              <div className="rnode">
                <div className="dot">{i + 1}</div>
                <div className="lbl" dangerouslySetInnerHTML={{ __html: s.replace('\n', '<br/>') }} />
              </div>
              {i < STEPS.length - 1 && <div className="rline" />}
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-secondary" style={{ marginTop: 20 }} onClick={() => onNavigate('chat')} type="button">
        Ask Sahayak about this
      </button>
    </div>
  );
}
