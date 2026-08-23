import { motion } from 'framer-motion';
import BrandMark from '../common/BrandMark';
import ParticleField from '../three/ParticleField';

const title = 'IP-SAKTI';
const letters = title.split('');

export default function IntroSequence({ onEnter, onSkip }) {
  return (
    <div className="intro-screen">
      <ParticleField
        className="hero-canvas"
        style={{ position: 'absolute', inset: 0 }}
      />

      <button className="intro-skip" onClick={onSkip} type="button">
        Skip intro
      </button>

      <div style={{ position: 'relative', zIndex: 1, padding: '0 20px' }}>
        <motion.div
          className="intro-mark"
          initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <BrandMark size={56} />
        </motion.div>

        <motion.div
          className="intro-eyebrow"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Ayurveda · Intellectual Property · Regulatory Intelligence
        </motion.div>

        <h1 className="intro-title" aria-label={title}>
          {letters.map((ch, i) => (
            <span className="word" key={i}>
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ delay: 0.65 + i * 0.045, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="intro-sub"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
        >
          Sahayak — your source-grounded guide to intellectual property, traditional knowledge
          and regulatory pathways for Ayurveda innovation.
        </motion.p>

        <motion.div
          className="intro-enter"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <button className="btn btn-primary" onClick={onEnter} type="button">
            Enter Sahayak
          </button>
        </motion.div>
      </div>
    </div>
  );
}
