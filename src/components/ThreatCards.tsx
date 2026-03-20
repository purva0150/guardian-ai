import { AlertTriangle, Link2, MessageSquare, Fingerprint, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ThreatIndicator } from '@/lib/phishing-engine';

const typeIcons = {
  keyword: Fingerprint,
  url: Link2,
  tone: MessageSquare,
  metadata: Layers,
  pattern: AlertTriangle,
};

const severityColors = {
  low: 'text-muted-foreground border-border',
  medium: 'text-suspicious border-suspicious/30',
  high: 'text-suspicious border-suspicious/40',
  critical: 'text-threat border-threat/40',
};

export default function ThreatCards({ threats }: { threats: ThreatIndicator[] }) {
  return (
    <div>
      <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-primary">
        Detected Threats
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {threats.map((t, i) => {
          const Icon = typeIcons[t.type];
          const color = severityColors[t.severity];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`glass-panel border ${color.split(' ')[1]} p-4`}
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon className={`h-4 w-4 ${color.split(' ')[0]}`} />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t.severity}
                </span>
              </div>
              <p className="mb-1 text-sm font-semibold text-foreground">{t.title}</p>
              <p className="mb-2 text-xs leading-relaxed text-muted-foreground">{t.description}</p>
              <div className="rounded-md bg-background/50 px-3 py-1.5">
                <p className="font-mono text-xs text-muted-foreground/80 break-all">{t.evidence}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
