import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { MessageCircle, ClipboardList, Mic, Paperclip, ArrowRight } from 'lucide-react';
import { MOCK, REASONING_STEPS } from '../data/mockData';
import { staggerContainer, staggerItem, fadeUp } from '../lib/variants';
import ParticleField from '../components/three/ParticleField';

function toPascalCase(kebab) {
  return kebab.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

const SUGGESTED = [
  'Can I patent my new Ashwagandha extraction process?',
  'Does my Ayurvedic product require biodiversity compliance?',
  "Classical vs proprietary Ayurvedic medicine — what's the difference?",
  'What changes if I export my product to the USA?',
];

const BUILT_FOR = ['AYUSH Startups', 'Researchers', 'Practitioners', 'MSMEs', 'Innovators', 'Biological-resource users'];

export default function Home({ onNavigate }) {
  const [query, setQuery] = useState('');

  return (
    <div>
      <div className="hero">
        <ParticleField className="hero-canvas" />
        <div className="hero-inner">
          <motion.span className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            AI-powered IP &amp; regulatory guidance for Ayurveda
          </motion.span>
          <motion.h1 className="font-display" variants={fadeUp} initial="hidden" animate="show">
            Navigate Ayurveda&rsquo;s IP &amp; regulatory landscape with confidence.
          </motion.h1>
          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Understand intellectual property, traditional knowledge, biodiversity obligations and
            product regulations through source-cited AI guidance — grounded in official documents,
            never guesswork.
          </motion.p>

          <motion.div
            style={{ display: 'flex', gap: 12, marginTop: 26, flexWrap: 'wrap' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
          >
            <button className="btn btn-primary" onClick={() => onNavigate('chat')} type="button">
              <MessageCircle size={16} />
              Ask Sahayak
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('assessment')} type="button">
              <ClipboardList size={16} />
              Assess My Product
            </button>
          </motion.div>

          <motion.div
            className="query-box"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.5 }}
          >
            <input
              placeholder="Ask about a formulation, patent, traditional knowledge, ABS, trademark, regulation or export requirement…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate('chat')}
            />
            <div className="query-actions">
              <div style={{ display: 'flex', gap: 8 }}>
                <div className="icon-btn">
                  <Mic size={16} />
                </div>
                <div className="icon-btn">
                  <Paperclip size={16} />
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => onNavigate('chat')} type="button">
                Ask <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>

          <div style={{ marginTop: 18 }}>
            {SUGGESTED.map((q) => (
              <span key={q} className="suggested-q" onClick={() => onNavigate('chat')} role="button" tabIndex={0}>
                {q}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="section-eyebrow">
          <span className="eyebrow">Explore by need</span>
        </div>
        <h2 className="section-title">Where does your innovation stand?</h2>
        <p className="section-sub">Choose a starting point, or let Sahayak guide you through the full assessment.</p>

        <motion.div className="grid grid-3" variants={staggerContainer(0.06)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          {MOCK.explore.map((card) => {
            const Icon = Icons[toPascalCase(card.icon)] || Icons.Compass;
            return (
              <motion.button key={card.title} type="button" variants={staggerItem} className="card explore-card" onClick={() => onNavigate(card.view)}>
                <div className="ic">
                  <Icon size={18} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </motion.button>
            );
          })}
        </motion.div>

        <div style={{ marginTop: 64 }}>
          <div className="section-eyebrow">
            <span className="eyebrow">How Sahayak works</span>
          </div>
          <h2 className="section-title">One question, a full reasoning path.</h2>
          <div className="card" style={{ padding: 28, marginTop: 20 }}>
            <div className="rpath">
              {REASONING_STEPS.map((step, i) => (
                <div key={step} style={{ display: 'contents' }}>
                  <div className="rnode">
                    <div className="dot">{i + 1}</div>
                    <div className="lbl">{step}</div>
                  </div>
                  {i < REASONING_STEPS.length - 1 && <div className="rline" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 64 }}>
          <div className="section-eyebrow">
            <span className="eyebrow">Built for</span>
          </div>
          <h2 className="section-title">Who Sahayak serves</h2>
          <div className="built-for">
            {BUILT_FOR.map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
