import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { PATHS } from '../../data/mockData';
import { staggerContainer, staggerItem } from '../../lib/variants';

const API_BASE = 'http://127.0.0.1:8000';

function toPascalCase(kebab) {
  return kebab
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

export default function ChoosePath({ onChoose, onSkip, language = 'en' }) {
  // Extract all static strings from mock data and headers to translate them
  const rawTexts = [
    "Choose your path",
    "Where would you like to start?",
    "Every path leads to the same source-grounded guidance — pick whichever matches what's on your mind right now.",
    "Get started",
    "Skip to home"
  ];

  // Also collect path titles and descriptions dynamically
  const pathTitles = PATHS.map((p) => p.title);
  const pathDescs = PATHS.map((p) => p.desc);
  const allTexts = [...rawTexts, ...pathTitles, ...pathDescs];

  const [translatedTexts, setTranslatedTexts] = useState(allTexts);

  useEffect(() => {
    if (language === 'en' || !language) {
      setTranslatedTexts(allTexts);
      return;
    }

    let cancelled = false;
    fetch(`${API_BASE}/api/translate-ui`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: allTexts, target_language: language }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.translated) {
          setTranslatedTexts(data.translated);
        }
      })
      .catch(() => {
        if (!cancelled) setTranslatedTexts(allTexts);
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  // Map translated arrays back to UI components
  const eyebrowText = translatedTexts[0];
  const titleText = translatedTexts[1];
  const subText = translatedTexts[2];
  const getStartedText = translatedTexts[3];
  const skipText = translatedTexts[4];

  const translatedPaths = PATHS.map((path, index) => ({
    ...path,
    title: translatedTexts[5 + index],
    desc: translatedTexts[5 + PATHS.length + index],
  }));

  return (
    <div className="path-screen">
      <motion.div
        className="path-head"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="eyebrow">{eyebrowText}</span>
        <h2 className="font-display">{titleText}</h2>
        <p>{subText}</p>
      </motion.div>

      <motion.div className="path-grid" variants={staggerContainer(0.08, 0.1)} initial="hidden" animate="show">
        {translatedPaths.map((path) => {
          const Icon = Icons[toPascalCase(path.icon)] || Icons.Compass;
          return (
            <motion.button
              key={path.view}
              type="button"
              variants={staggerItem}
              className="path-card"
              onClick={() => onChoose(path.view)}
            >
              <div className="ic">
                <Icon size={20} />
              </div>
              <h3>{path.title}</h3>
              <p>{path.desc}</p>
              <span className="go">
                {getStartedText} <ArrowRight size={13} />
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="path-skip">
        <button className="btn btn-ghost btn-sm" onClick={onSkip} type="button">
          {skipText}
        </button>
      </div>
    </div>
  );
}