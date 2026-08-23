/* ============================================================
   Reusable animation variants — keep motion consistent instead of
   writing bespoke transitions on every component.
   ============================================================ */

export const EASE = [0.22, 0.61, 0.36, 1];
export const EASE_OUT = [0.16, 1, 0.3, 1];

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE_OUT } },
};

export const staggerContainer = (stagger = 0.06, delay = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
};

/* Page-level transition used for every major view change. */
export const pageTransition = {
  initial: { opacity: 0, y: 10, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.38, ease: EASE_OUT } },
  exit: { opacity: 0, y: -6, scale: 0.995, transition: { duration: 0.22, ease: EASE } },
};

/* Card hover — applied via whileHover on motion components. */
export const cardHover = { y: -3, transition: { duration: 0.18, ease: EASE_OUT } };
export const cardTap = { scale: 0.98 };

export const chatUserMsg = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE_OUT } },
};

export const chatAiMsg = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT, delay: 0.08 } },
};
