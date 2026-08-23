import { motion } from 'framer-motion';
import { MOCK } from '../data/mockData';
import { staggerContainer, staggerItem } from '../lib/variants';

export default function IPNavigator({ onNavigate }) {
  return (
    <div className="container">
      <div className="section-eyebrow">
        <span className="eyebrow">IP Navigator</span>
      </div>
      <h2 className="section-title">Which protection fits your innovation?</h2>
      <p className="section-sub">Explore the IP instruments relevant to Ayurveda innovation, and when each may apply.</p>

      <motion.div className="grid grid-3" variants={staggerContainer(0.05)} initial="hidden" animate="show">
        {MOCK.ipTypes.map((ip) => (
          <motion.div key={ip.tag} variants={staggerItem} className="card ip-card">
            <div className="tag">{ip.tag}</div>
            <h3>{ip.title}</h3>
            <p>{ip.when}</p>
            <div className="qs">e.g. &ldquo;{ip.qs}&rdquo;</div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('chat')} type="button">
              Ask about {ip.title}
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
