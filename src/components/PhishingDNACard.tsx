import { Dna, Target, Brain, Gauge, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PhishingDNA } from '@/lib/phishing-engine';

const complexityColors = {
  basic: 'text-muted-foreground',
  intermediate: 'text-suspicious',
  advanced: 'text-suspicious',
  sophisticated: 'text-threat',
};

export default function PhishingDNACard({ dna }: { dna: PhishingDNA }) {
  const fields = [
    { icon: Target, label: 'Attack Type', value: dna.attackType },
    { icon: Brain, label: 'Psychological Trigger', value: dna.psychologicalTrigger },
    { icon: Layers, label: 'Target Category', value: dna.targetCategory },
    { icon: Gauge, label: 'Complexity', value: dna.complexityLevel.charAt(0).toUpperCase() + dna.complexityLevel.slice(1) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel p-6"
    >
      <div className="mb-5 flex items-center gap-2">
        <Dna className="h-4 w-4 text-primary" />
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          Phishing DNA Profile
        </h3>
      </div>

      <div className="space-y-4">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <p className={`text-sm font-semibold ${label === 'Complexity' ? complexityColors[dna.complexityLevel] : 'text-foreground'}`}>
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {dna.techniques.length > 0 && (
        <div className="mt-5 border-t border-border/50 pt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Techniques Used</p>
          <div className="flex flex-wrap gap-1.5">
            {dna.techniques.map(t => (
              <span key={t} className="rounded-md bg-threat/10 px-2 py-0.5 font-mono text-[10px] font-medium text-threat">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
