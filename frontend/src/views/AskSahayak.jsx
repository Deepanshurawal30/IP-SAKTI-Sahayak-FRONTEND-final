import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Sparkles, Anchor } from 'lucide-react';
import SourceCard from '../components/common/SourceCard';
import { ChatLoading } from '../components/common/States';
import { MOCK, docIdForSource } from '../data/mockData';
import { chatUserMsg, chatAiMsg, staggerContainer, staggerItem } from '../lib/variants';

const SUGGESTIONS = [
  'Can my Ayurveda innovation be patented?',
  'What regulations apply to my product?',
  'Does traditional knowledge affect my innovation?',
  'What should I check before filing?',
];

const CHIPS = ['Patent', 'Trademark', 'GI', 'Traditional Knowledge', 'ABS', 'Drug Regulation', 'Food', 'Export'];

/**
 * Demo AI answer used only to give the chat UI something real to
 * render while the backend is not yet connected. This is static UI
 * content, not a live model response.
 */
function buildDemoAnswer(question) {
  return {
    question,
    lead: 'Based on the available demo sources, this depends on whether your formulation is genuinely novel over what is already traditionally known — Section 3(p) of the Patents Act, 1970 excludes inventions that are, in effect, traditional knowledge.',
    why: [
      { title: 'Traditional knowledge exclusion', body: 'If your process mirrors a known Ayurvedic preparation, novelty and inventive step become hard to establish.' },
      { title: 'Biodiversity obligations', body: 'Using an Indian medicinal plant may trigger access and benefit-sharing requirements under the Biological Diversity Act.' },
      { title: 'Jurisdiction changes the answer', body: 'Export markets like the USA or EU apply separate patentability and regulatory regimes.' },
    ],
    confidence: 'moderate',
    sources: MOCK.sources.slice(0, 3),
    nextSteps: ['Complete Product Assessment', 'Run Patent Risk Assessment', 'Review Traditional Knowledge search'],
  };
}

function ConfidenceBadge({ level }) {
  const map = {
    high: { cls: 'conf-high', label: 'High confidence' },
    moderate: { cls: 'conf-mod', label: 'Moderate confidence' },
    low: { cls: 'conf-low', label: 'Low confidence' },
  };
  const v = map[level] || map.moderate;
  return <span className={`confidence-badge ${v.cls}`}>{v.label}</span>;
}

export default function AskSahayak({ onNavigate, backendStatus = 'checking' }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [focused, setFocused] = useState(false);
  const threadRef = useRef(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  const ask = (text) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setInput('');
    setThinking(true);
    // Static, clearly-labelled demo content only — no real API call.
    window.setTimeout(() => {
      setThinking(false);
      setMessages((m) => [...m, { role: 'ai', ...buildDemoAnswer(q) }]);
    }, 900);
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
              Ask Sahayak
            </h2>
            <div className={`status-live ${status.cls}`}>
              <span className="d" />
              {status.label}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="switch-group" style={{ padding: 2 }}>
              <div className="switch-opt active" style={{ fontSize: 11.5, padding: '5px 10px' }}>
                India
              </div>
            </div>
            <select className="lang-select">
              <option>English</option>
              <option>हिन्दी</option>
            </select>
          </div>
        </div>

        <div ref={threadRef} style={{ maxHeight: messages.length ? '58vh' : undefined, overflowY: messages.length ? 'auto' : undefined, paddingRight: 2 }}>
          {messages.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <div className="empty-state" style={{ padding: '48px 20px 20px' }}>
                <div className="ic-wrap">
                  <MessageCircle size={24} />
                </div>
                <h3>Ask Sahayak</h3>
                <p>Your source-grounded assistant for Ayurveda, intellectual property and regulatory intelligence.</p>
              </div>
              <motion.div
                className="grid grid-2"
                style={{ maxWidth: 640, margin: '10px auto 0' }}
                variants={staggerContainer(0.06)}
                initial="hidden"
                animate="show"
              >
                {SUGGESTIONS.map((s) => (
                  <motion.button key={s} type="button" variants={staggerItem} className="rec-q" onClick={() => ask(s)}>
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

                      <div className="section-block">
                        <h4 className="blocklabel">Confidence</h4>
                        <ConfidenceBadge level={m.confidence} />
                      </div>

                      <div className="section-block">
                        <h4 className="blocklabel">Sources</h4>
                        <motion.div variants={staggerContainer(0.05)} initial="hidden" animate="show">
                          {m.sources.map((s, si) => (
                            <motion.div key={s.id} variants={staggerItem}>
                              <SourceCard source={s} index={si} onClick={() => onNavigate?.('reader', docIdForSource(s))} />
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>

                      <div className="section-block">
                        <h4 className="blocklabel">Next steps</h4>
                        <div className="next-steps-row">
                          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate?.('assessment')} type="button">
                            Complete Product Assessment
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate?.('ipnav')} type="button">
                            Explore IP options
                          </button>
                        </div>
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
              placeholder="Ask a follow-up question…"
              onKeyDown={(e) => e.key === 'Enter' && ask(input)}
            />
            <button className="send-btn" onClick={() => ask(input)} disabled={!input.trim()} type="button" aria-label="Send message">
              <Send size={16} />
            </button>
          </div>
          <div className="chip-row">
            {CHIPS.map((c) => (
              <span key={c} className="chip" onClick={() => ask(`Tell me about ${c}`)} role="button" tabIndex={0}>
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
