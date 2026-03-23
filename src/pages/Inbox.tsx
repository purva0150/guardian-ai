import { useState, useEffect, useMemo } from 'react';
import { Mail, AlertTriangle, CheckCircle2, XCircle, Shield, Inbox as InboxIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { INBOX_EMAILS } from '@/lib/sample-data';
import { analyzeText, type PhishingResult } from '@/lib/phishing-engine';
import { useNavigate } from 'react-router-dom';

interface AnalyzedEmail {
  id: string;
  sender: string;
  email: string;
  subject: string;
  body: string;
  time: string;
  result: PhishingResult;
}

export default function InboxPage() {
  const navigate = useNavigate();

  const analyzed = useMemo<AnalyzedEmail[]>(() =>
    INBOX_EMAILS.map(e => ({ ...e, result: analyzeText(e.body, 'email') })),
  []);

  const threatCount = analyzed.filter(e => e.result.classification === 'phishing').length;

  const classIcon = (cls: string) => {
    if (cls === 'phishing') return <XCircle className="h-4 w-4 text-threat" />;
    if (cls === 'suspicious') return <AlertTriangle className="h-4 w-4 text-suspicious" />;
    return <CheckCircle2 className="h-4 w-4 text-safe" />;
  };

  return (
    <div className="relative min-h-screen px-4 pb-24 pt-24">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-30" />
      <div className="container relative mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
              <InboxIcon className="mr-2 inline h-6 w-6 text-primary" />
              Simulated Inbox
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Auto-scanning incoming messages · <span className="text-threat font-semibold">{threatCount} threat{threatCount !== 1 ? 's' : ''}</span> detected
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-safe" />
            <span className="font-mono text-xs text-safe">LIVE</span>
          </div>
        </div>

        <div className="space-y-2">
          {analyzed.map((email, i) => {
            const cls = email.result.classification;
            const borderCls = cls === 'phishing' ? 'border-l-threat' : cls === 'suspicious' ? 'border-l-suspicious' : 'border-l-safe';

            return (
              <motion.div
                key={email.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => {
                  // Navigate to analyze with this email pre-filled
                  sessionStorage.setItem('inbox-email', email.body);
                  navigate('/analyze');
                }}
                className={`glass-panel flex cursor-pointer items-center gap-4 border-l-[3px] ${borderCls} p-4 transition-all hover:border-primary/50 hover:bg-card/80`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{email.sender}</span>
                    <span className="text-xs text-muted-foreground">&lt;{email.email}&gt;</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{email.subject}</p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-mono text-[10px] text-muted-foreground">{email.time}</p>
                  <div className={`mt-1 inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                    cls === 'phishing' ? 'bg-threat/10 text-threat' :
                    cls === 'suspicious' ? 'bg-suspicious/10 text-suspicious' : 'bg-safe/10 text-safe'
                  }`}>
                    {classIcon(cls)}
                    {cls} {email.result.score}%
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
