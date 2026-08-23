import { motion } from 'framer-motion';

/**
 * A full-screen panel that scales up from the bottom to cover the
 * previous screen, then is unmounted by the parent once the
 * animation completes (onAnimationComplete).
 */
export default function WipeTransition({ onComplete }) {
  return (
    <motion.div
      className="intro-wipe"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={onComplete}
    />
  );
}
