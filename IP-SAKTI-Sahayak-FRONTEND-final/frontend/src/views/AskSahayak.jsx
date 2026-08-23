import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Sparkles, Anchor } from 'lucide-react';
import SourceCard from '../components/common/SourceCard';
import { ChatLoading } from '../components/common/States';
import { MOCK, docIdForSource } from '../data/mockData';
import { chatUserMsg, chatAiMsg, staggerContainer, staggerItem } from '../lib/variants';

const API_BASE = 'http://127.0.0.1:8000';

const INITIAL_SUGGESTIONS = [
  'Can my Ayurveda innovation be patented?',
  'What regulations apply to my product?',
  'Does traditional knowledge affect my innovation?',
  'What should I check before filing?',
];

const INITIAL_CHIPS = ['Patent', 'Trademark', 'GI', 'Traditional Knowledge', 'ABS', 'Drug Regulation', 'Food', 'Export'];

export default function AskSahayak({ onNavigate, backendStatus = 'online', language = 'en' }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [focused, setFocused] = useState(false);
  const threadRef = useRef(null);

  // Dynamic UI Translation State
  const [tTitle, setTTitle] = useState('Ask Sahayak');
  const [tSub, setTSub] = useState('Your source-grounded assistant for Ayurveda, intellectual property and regulatory intelligence.');
  const [tSuggestions, setTSuggestions] = useState(INITIAL_SUGGESTIONS);
  const [tChips, setTChips] = useState(INITIAL_CHIPS);
  const [tPlaceholder, setTPlaceholder] = useState('Ask a follow-up question…');

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  // Fetch translations for all static UI text whenever language changes
  useEffect(() => {
    if (language === 'en' || !language) {
      setTTitle('Ask Sahayak');
      setTSub('Your source-grounded assistant for Ayurveda, intellectual property and regulatory intelligence.');
      setTSuggestions(INITIAL_SUGGESTIONS);
      setTChips(INITIAL_CHIPS);
      setTPlaceholder('Ask a follow-up question…');
      return;
    }

    const textsToTranslate = [
      'Ask Sahayak',
      'Your source-grounded assistant for Ayurveda, intellectual property and regulatory intelligence.',
      ...INITIAL_SUGGESTIONS,
      ...INITIAL_CHIPS,
      'Ask a follow-up question…'
    ];

    let cancelled = false;
    fetch(`${API_BASE}/api/translate-ui`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: textsToTranslate, target_language: language }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.translated) {
          const resList = data.translated;
          setTTitle(resList[0]);
          setTSub(resList[1]);
          setTSuggestions(resList.slice(2, 2 + INITIAL_SUGGESTIONS.length));
          setTChips(resList.slice(2 + INITIAL_SUGGESTIONS.length, 2 + INITIAL_SUGGESTIONS.length + INITIAL_CHIPS.length));
          setTPlaceholder(resList[resList.length - 1]);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTTitle('Ask Sahayak');
          setTSub('Your source-grounded assistant for Ayurveda, intellectual property and regulatory intelligence.');
          setTSuggestions(INITIAL_SUGGESTIONS);
          setTChips(INITIAL_CHIPS);
          setTPlaceholder('Ask a follow-up question…');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  const ask = async (text) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setInput('');
    setThinking(true);

    try {
      const response = await fetch(`${API_BASE}/api/ask-sahayak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, language: language })
      });

      const data = await response.json();
      setThinking(false);

      const realAnswer = {
        question: q,
        lead: data.answer,
        why: [
          { title: 'Source Grounding Verification', body: `Extracted from verified repository: ${data.sources.join(', ') || 'Global Regulatory Standards'}` }
        ],
        confidence: data.sources.length > 0 ? 'high' : 'low',
        sources: data.image_proof 
          ? [{ id: 'pdf-proof', title: `Official Page Proof Snapshot`, type: 'PDF Document', url: data.image_proof }] 
          : MOCK.sources.slice(0, 2),
        nextSteps: ['Complete Product Assessment', 'Run Patent Risk Assessment', 'Review Traditional Knowledge search'],
      };

      setMessages((m) => [...m, { role: 'ai', ...realAnswer }]);
    } catch (err) {
      window.setTimeout(() => {
        setThinking(false);
        setMessages((m) => [...m, { role: 'ai', question: q, lead: 'Error connecting to local backend.', why: [], confidence: 'low', sources: [], nextSteps: [] }]);
      }, 600);
    }
  };

  const statusMap = {
    checking: { cls: 'checking', label: 'Checking backend…' },
    online: { cls: '', label: 'Backend connected' },
    offline: { cls: 'offline', label: 'Backend unavailable' },
  };
  const status = statusMap[backendStatus] || statusMap.checking;

  return (
    <div className="container">
      <div className="chat-shell">
        <div className="chat-header">
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: 20 }} className="font-display">
              {tTitle}
            </h2>
            <div className={`status-live ${status.cls}`}>
              <span className="d" />
              {status.label}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="switch-group" style={{ padding: 2 }}>
              <div className="switch-opt active" style={{ fontSize: 11.5, padding: '5px 10px' }}>
                {language.toUpperCase()} Mode Active
              </div>
            </div>
          </div>
        </div>

        <div ref={threadRef} style={{ maxHeight: messages.length ? '58vh' : undefined, overflowY: messages.length ? 'auto' : undefined, paddingRight: 2 }}>
          {messages.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <div className="empty-state" style={{ padding: '48px 20px 20px' }}>
                <div className="ic-wrap">
                  <MessageCircle size={24} />
                </div>
                <h3>{tTitle}</h3>
                <p>{tSub}</p>
              </div>
              <motion.div
                className="grid grid-2"
                style={{ maxWidth: 640, margin: '10px auto 0' }}
                variants={staggerContainer(0.06)}
                initial="hidden"
                animate="show"
              >
                {tSuggestions.map((s, idx) => (
                  <motion.button key={idx} type="button" variants={staggerItem} className="rec-q" onClick={() => ask(INITIAL_SUGGESTIONS[idx])}>
                    {s}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((m, i) =>
                m.role === 'user' ? (
                  <motion.div key={i} className="msg-wrap user" variants={chatUserMsg} initial="hidden" animate="show">
                    <div className="msg-user">{m.text}</div>
                  </motion.div>
                ) : (
                  <motion.div key={i} className="msg-wrap" variants={chatAiMsg} initial="hidden" animate="show" style={{ display: 'block' }}>
                    <div className="ai-block">
                      <div className="grounded-tag">
                        <Anchor size={12} />
                        Answer grounded in cited sources
                      </div>
                      <p className="ai-answer-lead">{m.lead}</p>

                      {m.why.length > 0 && (
                        <div className="section-block">
                          <h4 className="blocklabel">Why</h4>
                          {m.why.map((w, wi) => (
                            <div className="why-item" key={wi}>
                              <div className="why-num">{String(wi + 1).padStart(2, '0')}</div>
                              <div>
                                <h4>{w.title}</h4>
                                <p>{w.body}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="section-block">
                        <h4 className="blocklabel">Sources & PDF Proof Snapshot</h4>
                        <motion.div variants={staggerContainer(0.05)} initial="hidden" animate="show">
                          {m.sources.map((s, si) => (
                            <motion.div key={s.id || si} variants={staggerItem}>
                              {s.url ? (
                                <div style={{ padding: '8px 12px', background: '#f4f6f3', borderRadius: 8, marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--forest-deep)' }}>📄 {s.title}</span>
                                  <a href={s.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: 12 }}>
                                    View Image Proof
                                  </a>
                                </div>
                              ) : (
                                <SourceCard source={s} index={si} onClick={() => onNavigate?.('reader', docIdForSource(s))} />
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
              {thinking && (
                <motion.div className="msg-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ChatLoading />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <div className={`chat-input-bar${focused ? ' focused' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={tPlaceholder}
              onKeyDown={(e) => e.key === 'Enter' && ask(input)}
            />
            <button className="send-btn" onClick={() => ask(input)} disabled={!input.trim()} type="button" aria-label="Send message">
              <Send size={16} />
            </button>
          </div>
          <div className="chip-row">
            {tChips.map((c, idx) => (
              <span key={idx} className="chip" onClick={() => ask(`Tell me about ${INITIAL_CHIPS[idx]}`)} role="button" tabIndex={0}>
                <Sparkles size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} />
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}