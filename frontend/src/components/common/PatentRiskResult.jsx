import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TONE_COLOR = {
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  low: 'var(--low)',
};

const LEVEL_STYLE = {
  LOW: { cls: 'pill-ok', label: 'LOW RISK' },
  MODERATE: { cls: 'pill-saffron', label: 'MODERATE RISK' },
  HIGH: { cls: 'pill-low', label: 'HIGH RISK' },
};

/**
 * Visual-only component. Designed to later receive a real payload of
 * shape { score: number, riskLevel: 'LOW'|'MODERATE'|'HIGH', factors: [{label, value, tone}] }
 * from the patent-risk API. No scoring logic lives here.
 */
export default function PatentRiskResult({ score = 0, riskLevel = 'MODERATE', factors = [] }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const level = LEVEL_STYLE[riskLevel] || LEVEL_STYLE.MODERATE;
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const t = window.setTimeout(() => setAnimatedScore(score), 120);
    return () => window.clearTimeout(t);
  }, [score]);

  return (
    <div>
      <div className="section-eyebrow">
        <span className="eyebrow">Preliminary Patent Risk</span>
      </div>
      <div className="risk-score-wrap">
        <div className="risk-radial">
          <svg width="150" height="150" viewBox="0 0 150 150">
            <circle cx="75" cy="75" r={radius} fill="none" stroke="var(--ivory-deep)" strokeWidth="12" />
            <motion.circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke={score >= 66 ? 'var(--low)' : score >= 33 ? 'var(--warn)' : 'var(--ok)'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="num">
            <b>{animatedScore}</b>
            <span>/ 100</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <span className={`pill ${level.cls}`} style={{ marginBottom: 14, display: 'inline-flex' }}>
            {level.label}
          </span>
          <p style={{ fontSize: 13.8, color: '#6B6350', lineHeight: 1.6, maxWidth: 460 }}>
            This preliminary indicator reflects the factors below. It is not a legal determination —
            treat it as a starting point for deciding what to verify next.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        {factors.map((f) => (
          <div className="risk-factor" key={f.label}>
            <div className="risk-factor-head">
              <span>{f.label}</span>
              <span style={{ color: TONE_COLOR[f.tone] || 'var(--charcoal)' }}>{f.value}%</span>
            </div>
            <div className="risk-bar-track">
              <motion.div
                className="risk-bar-fill"
                style={{ background: TONE_COLOR[f.tone] || 'var(--forest)' }}
                initial={{ width: 0 }}
                animate={{ width: `${f.value}%` }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
