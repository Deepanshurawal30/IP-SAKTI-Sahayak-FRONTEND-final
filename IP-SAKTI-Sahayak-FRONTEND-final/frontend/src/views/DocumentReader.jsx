import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, ZoomIn, Bookmark, Share2, Sparkles, X, Anchor } from 'lucide-react';
import { READER_DOCS } from '../data/mockData';

export default function DocumentReader({ docId, onBack }) {
  const doc = READER_DOCS[docId] || READER_DOCS['patents-act-1970'];
  const [section, setSection] = useState(doc.defaultSection);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMessages, setPanelMessages] = useState([]);
  const [panelInput, setPanelInput] = useState('');

  useEffect(() => {
    setSection(doc.defaultSection);
    setPanelMessages([]);
  }, [docId, doc.defaultSection]);

  const content = doc.content[section];

  const openPanel = () => {
    setPanelOpen(true);
    setPanelMessages([
      { role: 'user', text: 'Explain this section in simple terms.' },
      {
        role: 'ai',
        text: 'In simple words: if your formulation is essentially the same as a preparation that is already traditionally known, it is unlikely to qualify for a new patent — because it is treated as traditional knowledge rather than a new invention.',
      },
    ]);
  };

  const panelAsk = () => {
    const text = panelInput.trim();
    if (!text) return;
    setPanelMessages((m) => [
      ...m,
      { role: 'user', text },
      { role: 'ai', text: 'Based on this document: further facts are needed for a conclusive answer. Sahayak recommends completing the Product Assessment for a fuller pathway.' },
    ]);
    setPanelInput('');
  };

  return (
    <div>
      <div className="reader-toolbar">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 6 }} type="button">
            <ArrowLeft size={14} />
            Knowledge Centre
          </button>
          <div className="reader-toolbar-title">{doc.title}</div>
        </div>
        <div className="reader-icons">
          <div className="icon-btn">
            <Search size={16} />
          </div>
          <div className="icon-btn">
            <ZoomIn size={16} />
          </div>
          <div className="icon-btn">
            <Bookmark size={16} />
          </div>
          <div className="icon-btn">
            <Share2 size={16} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={openPanel} type="button">
            <Sparkles size={14} />
            Ask Sahayak
          </button>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 24 }}>
        <div className="reader-shell">
          <div className="reader-toc">
            {doc.toc.map((ch) => (
              <div key={ch.chapter}>
                <div className="toc-chapter">{ch.chapter}</div>
                {ch.items.map((it) => (
                  <div
                    key={it.id}
                    className={`toc-item${it.id === section ? ' active' : ''}`}
                    onClick={() => setSection(it.id)}
                    role="button"
                    tabIndex={0}
                  >
                    {it.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="reader-content scrollbar-thin">
            <div className="reader-body">
              {typeof content === 'string' ? (
                <p>{content}</p>
              ) : (
                <>
                  <div className="section-highlight">
                    <b>{content.highlight.split(' — ')[0]}</b>
                    <p style={{ margin: '8px 0 0' }}>{content.highlight.split(' — ')[1]}</p>
                  </div>
                  <p>{content.body}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            id="ai-panel"
            className="open"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ai-panel-head">
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={16} color="#C08A2E" />
                Ask Sahayak
              </div>
              <button className="icon-btn" onClick={() => setPanelOpen(false)} type="button" aria-label="Close panel">
                <X size={16} />
              </button>
            </div>
            <div className="ai-panel-body scrollbar-thin">
              <div className="grounded-tag">
                <Anchor size={12} />
                Answer grounded in this document
              </div>
              {panelMessages.map((m, i) =>
                m.role === 'user' ? (
                  <div className="msg-wrap user" style={{ marginBottom: 14 }} key={i}>
                    <div className="msg-user">{m.text}</div>
                  </div>
                ) : (
                  <div className="ai-block" style={{ padding: 16, marginBottom: 14 }} key={i}>
                    <p style={{ fontSize: 13.8, lineHeight: 1.7, margin: 0 }}>{m.text}</p>
                  </div>
                )
              )}
            </div>
            <div className="ai-panel-input">
              <div className="chat-input-bar" style={{ margin: 0 }}>
                <input
                  value={panelInput}
                  onChange={(e) => setPanelInput(e.target.value)}
                  placeholder="Explain this section in simple Hindi…"
                  onKeyDown={(e) => e.key === 'Enter' && panelAsk()}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
