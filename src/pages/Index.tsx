import { Link } from 'react-router-dom';
import { Shield, Zap, Brain, Link2, Mail, ArrowRight, ShieldAlert, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';

const features = [
  { icon: Zap, title: 'Real-Time Detection', desc: 'Instant analysis of emails and URLs with multi-layer threat scoring.' },
  { icon: Brain, title: 'Explainable AI', desc: 'Understand exactly why something was flagged — no black boxes.' },
  { icon: Link2, title: 'URL Intelligence', desc: 'Domain analysis, typosquatting detection, and link reputation checks.' },
  { icon: Mail, title: 'Email Analysis', desc: 'NLP-powered scanning for urgency, threats, and social engineering.' },
  { icon: ShieldAlert, title: 'Phishing DNA', desc: 'Generate structured attack profiles with psychological trigger mapping.' },
  { icon: Activity, title: 'Attack Timeline', desc: 'Visualize how an attack would unfold step by step if a user interacted.' },
];

export default function Index() {
  return (
    <div className="relative min-h-screen pt-16">
      {/* Grid background */}
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-24 pt-20 md:pt-32">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-mono text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-slow" />
              THREAT DETECTION ACTIVE
            </div>
          </motion.div>

          <motion.h1
            className="mb-6 text-4xl font-black leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Detect Phishing
            <br />
            <span className="text-primary">Before It Strikes</span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            Multi-layer AI analysis that dissects emails and URLs, maps attack psychology, and explains threats in plain language.
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to="/analyze"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.97]"
            >
              Analyze Now
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-semibold text-foreground transition-all duration-200 hover:bg-secondary active:scale-[0.97]"
            >
              View History
            </Link>
          </motion.div>
        </div>

        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </section>

      {/* Features */}
      <section className="relative px-4 pb-32">
        <div className="container mx-auto max-w-5xl">
          <ScrollReveal>
            <h2 className="mb-4 text-center font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              Capabilities
            </h2>
            <p className="mx-auto mb-16 max-w-lg text-center text-2xl font-bold text-foreground md:text-3xl">
              Multi-layer threat intelligence at your fingertips
            </p>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.08}>
                <div className="glass-panel group flex h-full flex-col gap-4 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/20">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
