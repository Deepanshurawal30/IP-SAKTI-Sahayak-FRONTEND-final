import { ArrowUpRight } from 'lucide-react';

/**
 * Displays a single authoritative source. Purely presentational —
 * accepts a source object and an onClick handler; never fetches or
 * fabricates source data itself.
 */
export default function SourceCard({ source, index, onClick }) {
  return (
    <button className="source-card" onClick={onClick} type="button">
      <div>
        {typeof index === 'number' && (
          <span className="source-idx">[{String(index + 1).padStart(2, '0')}]</span>
        )}
        <h5>
          {source.title}
          {source.section ? ` — ${source.section}` : ''}
        </h5>
        <div className="meta">
          {[source.jurisdiction, source.authority, source.verified && `Verified ${source.verified}`]
            .filter(Boolean)
            .join(' · ')}
        </div>
      </div>
      <ArrowUpRight size={16} color="#8C8262" className="arrow-ic" />
    </button>
  );
}
