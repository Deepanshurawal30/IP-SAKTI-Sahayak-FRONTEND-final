import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { PATHS } from '../../data/mockData';
import { staggerContainer, staggerItem } from '../../lib/variants';

function toPascalCase(kebab) {
  return kebab
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

export default function ChoosePath({ onChoose, onSkip }) {
  return (
    <div className="path-screen">
      <motion.div
        className="path-head"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="eyebrow">Choose your path</span>
        <h2 className="font-display">Where would you like to start?</h2>
        <p>Every path leads to the same source-grounded guidance — pick whichever matches what's on your mind right now.</p>
      </motion.div>

      <motion.div className="path-grid" variants={staggerContainer(0.08, 0.1)} initial="hidden" animate="show">
        {PATHS.map((path) => {
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
                Get started <ArrowRight size={13} />
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="path-skip">
        <button className="btn btn-ghost btn-sm" onClick={onSkip} type="button">
          Skip to home
        </button>
      </div>
    </div>
  );
}
