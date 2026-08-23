import {
  MessageCircle,
  ClipboardList,
  Shield,
  Leaf,
  ScrollText,
  Library,
  Bookmark,
  FolderCheck,
  Gauge,
} from 'lucide-react';
import BrandMark from '../common/BrandMark';

const MAIN_NAV = [
  { view: 'chat', label: 'Ask Sahayak', icon: MessageCircle },
  { view: 'assessment', label: 'Product Assessment', icon: ClipboardList },
  { view: 'patent-risk', label: 'Patent Risk Assessment', icon: Gauge },
  { view: 'ipnav', label: 'IP Navigator', icon: Shield },
  { view: 'abs', label: 'ABS & Biodiversity', icon: Leaf },
  { view: 'tk', label: 'Traditional Knowledge', icon: ScrollText },
];

const KNOWLEDGE_NAV = [
  { view: 'knowledge', label: 'Knowledge Centre', icon: Library },
  { view: 'sources', label: 'Sources', icon: Bookmark },
  { view: 'assessments', label: 'My Assessments', icon: FolderCheck },
];

export default function Sidebar({ currentView, onNavigate, open, onClose }) {
  const NavGroup = ({ label, items }) => (
    <div className="nav-group">
      <div className="nav-label">{label}</div>
      {items.map((item) => (
        <button
          key={item.view}
          type="button"
          className={`nav-item${currentView === item.view ? ' active' : ''}`}
          onClick={() => {
            onNavigate(item.view);
            onClose?.();
          }}
          aria-current={currentView === item.view ? 'page' : undefined}
        >
          <item.icon />
          {item.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {open && (
        <div
          id="drawer-overlay"
          onClick={onClose}
          style={{ display: 'block' }}
          aria-hidden="true"
        />
      )}
      <aside
        id="sidebar"
        style={{
          transform: open ? 'translateX(0)' : undefined,
        }}
        className={open ? 'open' : ''}
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">
            <BrandMark />
            <div className="sidebar-brand-name">
              IP-SAKTI
              <br />
              Sahayak
            </div>
          </div>
          <div className="sidebar-brand-tag">Ayurveda · IP · Regulatory Intelligence</div>
        </div>
        <NavGroup label="Main" items={MAIN_NAV} />
        <NavGroup label="Knowledge" items={KNOWLEDGE_NAV} />
        <div id="sidebar-footer">
          SIH26045 · Ministry of Ayush
          <br />
          All India Institute of Ayurveda
        </div>
      </aside>
    </>
  );
}
