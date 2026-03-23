import { useState, useEffect } from 'react';
import { Shield, Link2, Mail, Loader2, AlertTriangle, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeText, saveScan, type PhishingResult } from '@/lib/phishing-engine';
import { SAMPLE_EMAILS, SAMPLE_URLS } from '@/lib/sample-data';
import ScrollReveal from '@/components/ScrollReveal';
import PhishingDNACard from '@/components/PhishingDNACard';
import AttackTimelineViz from '@/components/AttackTimelineViz';
import ThreatCards from '@/components/ThreatCards';
import AIExplainer from '@/components/AIExplainer';

export default function Analyze() {
  const [mode, setMode] = useState<'email' | 'url'>('email');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<PhishingResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showSamples, setShowSamples] = useState(false);

  // Check for inbox email
  useEffect(() => {
    const inboxEmail = sessionStorage.getItem('inbox-email');
    if (inboxEmail) {
      sessionStorage.removeItem('inbox-email');
      setMode('email');
      setInput(inboxEmail);
      // Auto-analyze
      setTimeout(() => {
        const res = analyzeText(inboxEmail, 'email');
        saveScan(inboxEmail, 'email', res);
        setResult(res);
      }, 100);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setAnalyzing(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1200));
    const res = analyzeText(input, mode);
    saveScan(input, mode, res);
    setResult(res);
    setAnalyzing(false);
  };

  const loadSample = (text: string) => {
    setInput(text);
    setShowSamples(false);
    setResult(null);
  };

  const classificationConfig = {
    safe: { color: 'text-safe', bg: 'bg-safe/10', border: 'border-safe/30', glow: 'glow-safe', icon: CheckCircle2, label: 'SAFE' },
    suspicious: { color: 'text-suspicious', bg: 'bg-suspicious/10', border: 'border-suspicious/30', glow: '', icon: AlertTriangle, label: 'SUSPICIOUS' },
    phishing: { color: 'text-threat', bg: 'bg-threat/10', border: 'border-threat/30', glow: 'glow-threat', icon: XCircle, label: 'PHISHING' },
  };

  return (
    <div className="relative min-h-screen px-4 pb-24 pt-24">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-30" />

      <div className="container relative mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground md:text-4xl">
              Threat Analysis
            </h1>
            <p className="text-muted-foreground">Paste an email or URL to scan for phishing indicators</p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Left Panel */}
          <div className="space-y-4">
            <ScrollReveal delay={0.1}>
              <div className="glass-panel p-5">
                {/* Mode toggle */}
                <div className="mb-4 flex gap-2">
                  {[
                    { key: 'email' as const, label: 'EMAIL', icon: Mail },
                    { key: 'url' as const, label: 'URL', icon: Link2 },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => { setMode(key); setResult(null); setShowSamples(false); }}
                      className={`flex items-center gap-2 rounded-md px-4 py-2 font-mono text-xs font-bold tracking-wider transition-all duration-200 active:scale-[0.97] ${
                        mode === key
                          ? 'bg-primary/10 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground border border-transparent'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
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
                    className="mb-3 h-36 w-full resize-none rounded-lg border border-border bg-background/50 p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors leading-relaxed"
                  />
                ) : (
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="https://suspicious-link.example.com"
                    className="mb-3 w-full rounded-lg border border-border bg-background/50 p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleAnalyze}
                    disabled={!input.trim() || analyzing}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {analyzing ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Scanning...</>
                    ) : (
                      <><Shield className="h-3.5 w-3.5" /> Analyze</>
                    )}
                  </button>
                  <button
                    onClick={() => setShowSamples(!showSamples)}
                    className="rounded-lg border border-border px-4 py-2.5 font-mono text-xs font-semibold text-muted-foreground transition-colors hover:border-muted-foreground hover:text-foreground"
                  >
                    SAMPLE
                  </button>
                </div>

                {/* Sample templates dropdown */}
                <AnimatePresence>
                  {showSamples && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="space-y-1.5 rounded-lg border border-border bg-background/60 p-2">
                        <p className="px-2 font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                          Sample Templates
                        </p>
                        {(mode === 'email' ? SAMPLE_EMAILS : SAMPLE_URLS).map((s, i) => (
                          <button
                            key={i}
                            onClick={() => loadSample('body' in s ? s.body : s.url)}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-secondary"
                          >
                            <FileText className="h-3 w-3 shrink-0 text-primary" />
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>

            {/* AI Explainer */}
            <ScrollReveal delay={0.2}>
              <AIExplainer result={result} />
            </ScrollReveal>
          </div>

          {/* Right Panel - Results */}
          <div>
            {/* Scanning animation */}
            <AnimatePresence>
              {analyzing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
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

            {/* Empty state */}
            {!result && !analyzing && (
              <div className="glass-panel flex min-h-[400px] items-center justify-center p-8">
                <div className="text-center">
                  <Shield className="mx-auto mb-3 h-12 w-12 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground">Paste an email or URL and click Analyze</p>
                </div>
              </div>
            )}

            {/* Results */}
            <AnimatePresence>
              {result && !analyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  {/* Score header */}
                  {(() => {
                    const cfg = classificationConfig[result.classification];
                    const Icon = cfg.icon;
                    return (
                      <div className={`glass-panel ${cfg.glow} border ${cfg.border} p-5`}>
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cfg.bg}`}>
                              <Icon className={`h-6 w-6 ${cfg.color}`} />
                            </div>
                            <div>
                              <p className={`font-mono text-xs font-bold tracking-widest ${cfg.color}`}>{cfg.label}</p>
                              <p className="text-xs text-muted-foreground">
                                {result.score}% confidence · {result.dna.attackType}
                              </p>
                            </div>
                          </div>
                          <div className="text-center sm:text-right">
                            <p className={`font-mono text-3xl font-black ${cfg.color}`}>{result.score}%</p>
                            <p className="text-[10px] text-muted-foreground">Risk Score</p>
                          </div>
                        </div>
                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.score}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`h-full rounded-full ${
                              result.classification === 'phishing' ? 'bg-threat' :
                              result.classification === 'suspicious' ? 'bg-suspicious' : 'bg-safe'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })()}

                  {result.threats.length > 0 && <ThreatCards threats={result.threats} />}

                  {result.classification !== 'safe' && (
                    <div className="grid gap-5 lg:grid-cols-2">
                      <PhishingDNACard dna={result.dna} />
                      <AttackTimelineViz steps={result.timeline} />
                    </div>
                  )}

                  <div className="glass-panel p-5">
                    <h3 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                      Recommended Actions
                    </h3>
                    <ul className="space-y-2">
                      {result.classification === 'safe' ? (
                        <li className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safe" />
                          No immediate threats detected. Always remain vigilant.
                        </li>
                      ) : (
                        <>
                          <li className="flex items-start gap-2 text-xs text-muted-foreground">
                            <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-threat" />
                            Do not click any links or download attachments.
                          </li>
                          <li className="flex items-start gap-2 text-xs text-muted-foreground">
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-suspicious" />
                            Report to your IT/security team.
                          </li>
                          <li className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                            If you clicked a link, change passwords and enable 2FA.
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
      </div>
    </div>
  );
}
