import { AlertTriangle, RefreshCw } from 'lucide-react';

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="ic-wrap">
          <Icon size={24} />
        </div>
      )}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = "Sahayak couldn't complete that request. This is a UI-only preview state — the production build will retry against the live API.",
  onRetry,
}) {
  return (
    <div className="error-state">
      <div className="ic-wrap">
        <AlertTriangle size={22} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {onRetry && (
        <button className="btn btn-secondary btn-sm" onClick={onRetry} type="button">
          <RefreshCw size={14} />
          Retry
        </button>
      )}
    </div>
  );
}

export function BackendUnavailable({ onRetry }) {
  return (
    <ErrorState
      title="Backend unavailable"
      description="Sahayak can't reach the API right now. Once the backend is connected, this screen will show live results instead of this placeholder."
      onRetry={onRetry}
    />
  );
}

export function Skeleton({ width = '100%', height = 14, radius = 8, style }) {
  return <div className="skeleton" style={{ width, height, borderRadius: radius, ...style }} />;
}

export function ChatLoading() {
  return (
    <div className="ai-block" aria-label="Sahayak is composing a response" role="status">
      <div className="typing">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export function CardLoading({ rows = 3 }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <Skeleton width="60%" height={16} style={{ marginBottom: 14 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={11} style={{ marginBottom: 10 }} />
      ))}
    </div>
  );
}

export function AssessmentLoading() {
  return (
    <div className="card" style={{ padding: 32 }}>
      <Skeleton width="40%" height={12} style={{ marginBottom: 22 }} />
      <Skeleton width="70%" height={22} style={{ marginBottom: 26 }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} height={48} radius={12} style={{ marginBottom: 10 }} />
      ))}
    </div>
  );
}

export function ReportLoading() {
  return (
    <div className="card" style={{ padding: 30 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ marginBottom: 22 }}>
          <Skeleton width="30%" height={13} style={{ marginBottom: 10 }} />
          <Skeleton height={11} style={{ marginBottom: 6 }} />
          <Skeleton width="85%" height={11} />
        </div>
      ))}
    </div>
  );
}

export function SourceLoading({ rows = 3 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="source-card" style={{ pointerEvents: 'none' }}>
          <div style={{ flex: 1 }}>
            <Skeleton width="55%" height={14} style={{ marginBottom: 8 }} />
            <Skeleton width="35%" height={11} />
          </div>
        </div>
      ))}
    </div>
  );
}
