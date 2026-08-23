import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { LANGUAGES } from '../../data/mockData';
import { staggerContainer, staggerItem } from '../../lib/variants';

export default function LanguageSelect({ selected, onSelect, onContinue }) {
  const [pending, setPending] = useState(selected || 'en');

  const choose = (code) => {
    setPending(code);
    onSelect(code);
  };

  return (
    <div className="lang-screen">
      <motion.div
        className="lang-head"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="eyebrow">Choose your language</span>
        <h2>अपनी भाषा चुनें</h2>
        <p>Sahayak will guide you in the language you're most comfortable with. You can change this anytime from the top bar.</p>
      </motion.div>

      <motion.div className="lang-grid" variants={staggerContainer(0.035)} initial="hidden" animate="show">
        {LANGUAGES.map((lang) => (
          <motion.button
            key={lang.code}
            type="button"
            variants={staggerItem}
            className={`lang-card${pending === lang.code ? ' selected' : ''}`}
            onClick={() => choose(lang.code)}
            aria-pressed={pending === lang.code}
          >
            <span className="check">{pending === lang.code && <Check size={11} />}</span>
            <div className="native">{lang.native}</div>
            <div className="english">{lang.english}</div>
          </motion.button>
        ))}
      </motion.div>

      <div className="lang-footer">
        <button className="btn btn-primary" onClick={onContinue} type="button">
          Continue
        </button>
      </div>
    </div>
  );
}
