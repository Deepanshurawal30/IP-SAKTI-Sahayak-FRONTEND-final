import { motion } from 'framer-motion';
import { pageTransition } from '../../lib/variants';

export default function PageTransition({ children, ...props }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      {...props}
    >
      {children}
    </motion.div>
  );
}
