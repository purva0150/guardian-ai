import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { AttackTimelineStep } from '@/lib/phishing-engine';

const riskColors = {
  low: 'bg-safe border-safe/40',
  medium: 'bg-suspicious border-suspicious/40',
  high: 'bg-threat/80 border-threat/40',
  critical: 'bg-threat border-threat/60',
};

const riskDotColors = {
  low: 'bg-safe',
  medium: 'bg-suspicious',
  high: 'bg-threat/80',
  critical: 'bg-threat',
};

export default function AttackTimelineViz({ steps }: { steps: AttackTimelineStep[] }) {
  if (steps.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel p-6"
    >
      <div className="mb-5 flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          Attack Timeline
        </h3>
      </div>

      <div className="relative space-y-0">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

        {steps.map((step, i) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex gap-4 pb-5 last:pb-0"
          >
            {/* Dot */}
            <div className={`relative z-10 mt-1 h-[15px] w-[15px] shrink-0 rounded-full border-2 ${riskColors[step.risk]}`}>
              <div className={`absolute inset-[3px] rounded-full ${riskDotColors[step.risk]}`} />
            </div>

            <div className="min-w-0">
              <div className="mb-0.5 flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-muted-foreground">
                  STEP {step.step}
                </span>
                <span className={`rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                  step.risk === 'critical' ? 'bg-threat/15 text-threat' :
                  step.risk === 'high' ? 'bg-threat/10 text-threat/80' :
                  step.risk === 'medium' ? 'bg-suspicious/15 text-suspicious' :
                  'bg-safe/10 text-safe'
                }`}>
                  {step.risk}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">{step.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
