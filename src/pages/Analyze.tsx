import { useState } from 'react';
import { Shield, Link2, Mail, Loader2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeText, saveScan, type PhishingResult } from '@/lib/phishing-engine';
import ScrollReveal from '@/components/ScrollReveal';
import PhishingDNACard from '@/components/PhishingDNACard';
import AttackTimelineViz from '@/components/AttackTimelineViz';
import ThreatCards from '@/components/ThreatCards';

export default function Analyze() {
  const [mode, setMode] = useState<'email' | 'url'>('email');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<PhishingResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setAnalyzing(true);
    setResult(null);

    // Simulate processing delay for UX
    await new Promise(r => setTimeout(r, 1200));

    const res = analyzeText(input, mode);
    saveScan(input, mode, res);
    setResult(res);
    setAnalyzing(false);
  };

  const classificationConfig = {
    safe: { color: 'text-safe', bg: 'bg-safe/10', border: 'border-safe/30', glow: 'glow-safe', icon: CheckCircle2, label: 'SAFE' },
    suspicious: { color: 'text-suspicious', bg: 'bg-suspicious/10', border: 'border-suspicious/30', glow: '', icon: AlertTriangle, label: 'SUSPICIOUS' },
    phishing: { color: 'text-threat', bg: 'bg-threat/10', border: 'border-threat/30', glow: 'glow-threat', icon: XCircle, label: 'PHISHING' },
  };

  return (
    <div className="relative min-h-screen px-4 pb-24 pt-24">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-30" />

      <div className="container relative mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground md:text-4xl">
              Threat Analysis
            </h1>
            <p className="text-muted-foreground">Paste an email or URL to scan for phishing indicators</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="glass-panel p-6">
            {/* Mode toggle */}
            <div className="mb-5 flex gap-2">
              {[
                { key: 'email' as const, label: 'Email Text', icon: Mail },
                { key: 'url' as const, label: 'URL', icon: Link2 },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => { setMode(key); setResult(null); }}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                    mode === key
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Input */}
            {mode === 'email' ? (
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Paste suspicious email content here..."
                className="mb-4 h-40 w-full resize-none rounded-lg border border-border bg-background/50 p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            ) : (
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="https://suspicious-link.example.com"
                className="mb-4 w-full rounded-lg border border-border bg-background/50 p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            )}

            <button
              onClick={handleAnalyze}
              disabled={!input.trim() || analyzing}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Analyze
                </>
              )}
            </button>
          </div>
        </ScrollReveal>

        {/* Scanning animation */}
        <AnimatePresence>
          {analyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <div className="glass-panel relative overflow-hidden p-8 text-center">
                <div className="scan-line absolute inset-0" />
                <div className="relative">
                  <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
                  <p className="font-mono text-sm text-primary">Running multi-layer analysis...</p>
                  <div className="mt-4 flex justify-center gap-4 font-mono text-xs text-muted-foreground">
                    <span>NLP Scan ●</span>
                    <span>URL Analysis ●</span>
                    <span>Pattern Match ●</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !analyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 space-y-6"
            >
              {/* Score header */}
              {(() => {
                const cfg = classificationConfig[result.classification];
                const Icon = cfg.icon;
                return (
                  <div className={`glass-panel ${cfg.glow} border ${cfg.border} p-6`}>
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${cfg.bg}`}>
                          <Icon className={`h-7 w-7 ${cfg.color}`} />
                        </div>
                        <div>
                          <p className={`font-mono text-xs font-bold tracking-widest ${cfg.color}`}>{cfg.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {result.threats.length} threat indicator{result.threats.length !== 1 ? 's' : ''} detected
                          </p>
                        </div>
                      </div>
                      <div className="text-center sm:text-right">
                        <p className={`font-mono text-4xl font-black ${cfg.color}`}>
                          {result.score}%
                        </p>
                        <p className="text-xs text-muted-foreground">Risk Score</p>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score}%` }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full rounded-full ${
                          result.classification === 'phishing' ? 'bg-threat' :
                          result.classification === 'suspicious' ? 'bg-suspicious' : 'bg-safe'
                        }`}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Threats */}
              {result.threats.length > 0 && <ThreatCards threats={result.threats} />}

              {/* DNA + Timeline */}
              {result.classification !== 'safe' && (
                <div className="grid gap-6 lg:grid-cols-2">
                  <PhishingDNACard dna={result.dna} />
                  <AttackTimelineViz steps={result.timeline} />
                </div>
              )}

              {/* Recommendations */}
              <div className="glass-panel p-6">
                <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-primary">
                  Recommended Actions
                </h3>
                <ul className="space-y-3">
                  {result.classification === 'safe' ? (
                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-safe" />
                      No immediate threats detected. Always remain vigilant with unsolicited messages.
                    </li>
                  ) : (
                    <>
                      <li className="flex items-start gap-3 text-sm text-muted-foreground">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-threat" />
                        Do not click any links or download attachments from this message.
                      </li>
                      <li className="flex items-start gap-3 text-sm text-muted-foreground">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-suspicious" />
                        Report this to your IT/security team and mark as phishing.
                      </li>
                      <li className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        If you already clicked a link, change your passwords immediately and enable 2FA.
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
