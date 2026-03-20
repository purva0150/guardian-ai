import { useState, useMemo } from 'react';
import { Clock, Trash2, Filter, CheckCircle2, AlertTriangle, XCircle, Mail, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHistory, clearHistory, type ScanRecord } from '@/lib/phishing-engine';
import ScrollReveal from '@/components/ScrollReveal';

type FilterType = 'all' | 'safe' | 'suspicious' | 'phishing';

const classIcons = { safe: CheckCircle2, suspicious: AlertTriangle, phishing: XCircle };
const classColors = {
  safe: 'text-safe bg-safe/10',
  suspicious: 'text-suspicious bg-suspicious/10',
  phishing: 'text-threat bg-threat/10',
};

export default function History() {
  const [history, setHistory] = useState<ScanRecord[]>(getHistory());
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return history;
    return history.filter(h => h.result.classification === filter);
  }, [history, filter]);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="relative min-h-screen px-4 pb-24 pt-24">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-30" />

      <div className="container relative mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-1 text-3xl font-black tracking-tight text-foreground">Scan History</h1>
              <p className="text-sm text-muted-foreground">{history.length} scan{history.length !== 1 ? 's' : ''} recorded</p>
            </div>
            {history.length > 0 && (
              <button
                onClick={handleClear}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-threat/30 hover:text-threat active:scale-[0.97]"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </button>
            )}
          </div>
        </ScrollReveal>

        {/* Filters */}
        {history.length > 0 && (
          <ScrollReveal delay={0.1}>
            <div className="mb-6 flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {(['all', 'phishing', 'suspicious', 'safe'] as FilterType[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 active:scale-[0.97] ${
                    filter === f
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <ScrollReveal>
            <div className="glass-panel flex flex-col items-center gap-3 py-16 text-center">
              <Clock className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                {history.length === 0 ? 'No scans yet. Analyze an email or URL to get started.' : 'No results match this filter.'}
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((record, i) => {
                const Icon = classIcons[record.result.classification];
                const color = classColors[record.result.classification];
                return (
                  <motion.div
                    key={record.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-panel flex items-center gap-4 p-4"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        {record.mode === 'email' ? (
                          <Mail className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <Link2 className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span className="font-mono text-[10px] uppercase text-muted-foreground">
                          {record.mode}
                        </span>
                        <span className="text-[10px] text-muted-foreground/50">
                          {new Date(record.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="truncate text-sm text-foreground">{record.input}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`font-mono text-lg font-black ${color.split(' ')[0]}`}>
                        {record.result.score}%
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
