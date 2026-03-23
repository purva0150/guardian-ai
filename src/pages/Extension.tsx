import { Shield, Download, Chrome, CheckCircle2, Mail, Zap } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function ExtensionPage() {
  const handleDownload = () => {
    fetch('/phishguard-extension.zip')
      .then(res => {
        if (!res.ok) throw new Error(`Download failed: ${res.status}`);
        return res.blob();
      })
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'phishguard-extension.zip';
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch(() => alert('Extension package not found. Build may be in progress.'));
  };

  return (
    <div className="relative min-h-screen px-4 pb-24 pt-24">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-30" />
      <div className="container relative mx-auto max-w-3xl">
        <ScrollReveal>
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 glow-primary">
              <Chrome className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground md:text-4xl">
              Gmail Extension
            </h1>
            <p className="text-muted-foreground">
              Analyze emails directly inside Gmail with PhishGuard
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="glass-panel p-8 text-center">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.97]"
            >
              <Download className="h-5 w-5" />
              Download Extension
            </button>
            <p className="mt-3 text-xs text-muted-foreground">Chrome / Edge / Brave / Arc</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Mail, title: 'Gmail Integration', desc: 'Detects when you open an email and shows an analysis banner' },
              { icon: Shield, title: 'Full Analysis', desc: 'Same multi-layer engine with phishing DNA and attack timeline' },
              { icon: Zap, title: 'Instant Results', desc: 'AI explainer, threat indicators, and recommendations in one click' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-panel p-5">
                <Icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="mb-1 text-sm font-bold text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-8 glass-panel p-6">
            <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Installation Steps
            </h2>
            <ol className="space-y-3">
              {[
                'Download and unzip the extension file',
                'Open chrome://extensions in your browser',
                'Enable "Developer mode" (toggle in top-right)',
                'Click "Load unpacked" and select the unzipped folder',
                'Open Gmail — PhishGuard will auto-detect emails',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
