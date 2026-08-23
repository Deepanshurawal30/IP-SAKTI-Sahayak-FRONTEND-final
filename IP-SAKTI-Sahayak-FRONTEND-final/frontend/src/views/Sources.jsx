import { motion } from 'framer-motion';
import SourceCard from '../components/common/SourceCard';
import { MOCK, docIdForSource } from '../data/mockData';
import { staggerContainer, staggerItem } from '../lib/variants';

export default function Sources({ onOpenDocument }) {
  return (
    <div className="container">
      <div className="section-eyebrow">
        <span className="eyebrow">Source system</span>
      </div>
      <h2 className="section-title">Sources cited across Sahayak</h2>
      <p className="section-sub">
        Every important AI answer shows traceable, authoritative source citations. Click any source to open the exact document and section.
      </p>
      <motion.div variants={staggerContainer(0.04)} initial="hidden" animate="show">
        {MOCK.sources.map((s, i) => (
          <motion.div key={s.id} variants={staggerItem}>
            <SourceCard source={s} index={i} onClick={() => onOpenDocument(docIdForSource(s))} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
