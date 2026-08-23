import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Generic step wizard. `steps` is an array of { label, render(props) }.
 * The parent owns all form state; this component only handles chrome:
 * progress bar, step label, nav buttons, and step transition motion.
 */
export default function Wizard({ steps, current, onBack, onNext, onFinish, canProceed = true, finishLabel = 'Finish' }) {
  const step = steps[current];
  const isLast = current === steps.length - 1;

  return (
    <div className="wizard-shell">
      <div className="wizard-progress">
        {steps.map((_, i) => (
          <div key={i} className={`seg${i < current ? ' done' : i === current ? ' current' : ''}`} />
        ))}
      </div>
      <div className="card" style={{ padding: 32 }}>
        <div className="step-label">
          STEP {current + 1} OF {steps.length}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="wizard-q">{step.label}</h3>
            {step.render()}
          </motion.div>
        </AnimatePresence>

        <div className="wizard-nav">
          <button className="btn btn-ghost" onClick={onBack} disabled={current === 0} type="button">
            <ArrowLeft size={15} />
            Back
          </button>
          {isLast ? (
            <button className="btn btn-primary" onClick={onFinish} disabled={!canProceed} type="button">
              {finishLabel}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onNext} disabled={!canProceed} type="button">
              Next
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
