import { Menu, Sparkles } from 'lucide-react';
import { LANGUAGES } from '../../data/mockData';

export default function Topbar({
  onOpenDrawer,
  onNavigateHome,
  jurisdiction,
  onJurisdictionChange,
  language,
  onLanguageChange,
}) {
  return (
    <div id="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button id="menu-toggle" className="icon-btn" onClick={onOpenDrawer} type="button" aria-label="Open navigation menu">
          <Menu size={18} />
        </button>
        <button
          type="button"
          className="nav-item active"
          style={{ color: 'var(--forest-deep)', fontWeight: 700, padding: '6px 4px', background: 'transparent' }}
          onClick={onNavigateHome}
        >
          <Sparkles size={16} style={{ color: 'var(--saffron)' }} />
          <span className="font-display" style={{ fontSize: 15 }}>
            IP-SAKTI Sahayak
          </span>
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="switch-group" id="jurisdiction-switch">
          <button
            type="button"
            className={`switch-opt${jurisdiction === 'india' ? ' active' : ''}`}
            onClick={() => onJurisdictionChange('india')}
          >
            🇮🇳 India
          </button>
          <button
            type="button"
            className={`switch-opt${jurisdiction === 'intl' ? ' active' : ''}`}
            onClick={() => onJurisdictionChange('intl')}
          >
            🌎 International
          </button>
        </div>
        <select
          className="lang-select"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          aria-label="Interface language"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.native}
            </option>
          ))}
        </select>
        <div className="icon-btn" style={{ borderRadius: '50%', background: 'var(--forest)', color: '#fff', border: 'none' }}>
          AS
        </div>
      </div>
    </div>
  );
}
