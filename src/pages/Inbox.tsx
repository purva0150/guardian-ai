import { useState } from 'react';
import { Mail, Star, Search, RefreshCw, MoreVertical, ChevronLeft, ChevronRight, Archive, Trash2, AlertTriangle, Paperclip, FileText, Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { INBOX_EMAILS, type InboxEmail } from '@/lib/sample-data';
import { analyzeText, type PhishingResult } from '@/lib/phishing-engine';
import { useNavigate } from 'react-router-dom';

type Category = 'primary' | 'promotions' | 'social' | 'updates';

const CATEGORIES: { key: Category; label: string; icon: string; count?: number }[] = [
  { key: 'primary', label: 'Primary', icon: '📥' },
  { key: 'promotions', label: 'Promotions', icon: '🏷️', count: 9 },
  { key: 'social', label: 'Social', icon: '👥', count: 50 },
  { key: 'updates', label: 'Updates', icon: '🔔', count: 50 },
];

const SIDEBAR_ITEMS = [
  { label: 'Inbox', icon: '📥', count: 3897, active: true },
  { label: 'Starred', icon: '⭐' },
  { label: 'Snoozed', icon: '🕐' },
  { label: 'Sent', icon: '📤' },
  { label: 'Drafts', icon: '📝', count: 10 },
  { label: 'Purchases', icon: '🛒', count: 3 },
  { label: 'More', icon: '▾' },
];

export default function InboxPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>('primary');
  const [selectedEmail, setSelectedEmail] = useState<InboxEmail | null>(null);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PhishingResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [starredIds, setStarredIds] = useState<Set<string>>(
    new Set(INBOX_EMAILS.filter(e => e.starred).map(e => e.id))
  );
  const [readIds, setReadIds] = useState<Set<string>>(
    new Set(INBOX_EMAILS.filter(e => e.read).map(e => e.id))
  );

  const filteredEmails = INBOX_EMAILS.filter(e => e.category === activeCategory);

  const openEmail = (email: InboxEmail) => {
    setSelectedEmail(email);
    setReadIds(prev => new Set([...prev, email.id]));
    setShowAnalysisPopup(true);
    setAnalysisResult(null);
    setAnalyzing(false);
  };

  const toggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setStarredIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const runAnalysis = () => {
    if (!selectedEmail) return;
    setAnalyzing(true);
    setShowAnalysisPopup(false);
    setTimeout(() => {
      const res = analyzeText(selectedEmail.body, 'email');
      setAnalysisResult(res);
      setAnalyzing(false);
    }, 1500);
  };

  const goToFullAnalysis = () => {
    if (!selectedEmail) return;
    sessionStorage.setItem('inbox-email', selectedEmail.body);
    navigate('/analyze');
  };

  const closeEmail = () => {
    setSelectedEmail(null);
    setShowAnalysisPopup(false);
    setAnalysisResult(null);
    setAnalyzing(false);
  };

  return (
    <div className="relative min-h-screen pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card/50 lg:flex">
          {/* Compose button */}
          <div className="p-3">
            <button className="flex w-full items-center gap-3 rounded-2xl bg-secondary px-6 py-3.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary/80">
              <span className="text-lg">✏️</span>
              Compose
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-2 py-1">
            {SIDEBAR_ITEMS.map(item => (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-r-full px-4 py-1.5 text-sm transition-colors ${
                  item.active
                    ? 'bg-primary/10 font-bold text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/60'
                }`}
              >
                <span className="w-5 text-center text-sm">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.count && (
                  <span className="text-xs text-muted-foreground">{item.count.toLocaleString()}</span>
                )}
              </button>
            ))}

            <div className="mt-4 border-t border-border pt-3 px-4">
              <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                Labels <span className="ml-auto cursor-pointer">+</span>
              </p>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {!selectedEmail ? (
            <>
              {/* Toolbar */}
              <div className="flex items-center gap-2 border-b border-border px-4 py-2">
                <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
                <button className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary">
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary">
                  <MoreVertical className="h-4 w-4" />
                </button>

                {/* PhishGuard badge */}
                <div className="ml-2 flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">PhishGuard Active</span>
                </div>

                <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                  <span>1–{filteredEmails.length} of {INBOX_EMAILS.length}</span>
                  <button className="rounded p-1 hover:bg-secondary"><ChevronLeft className="h-4 w-4" /></button>
                  <button className="rounded p-1 hover:bg-secondary"><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>

              {/* Category tabs */}
              <div className="flex border-b border-border">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`relative flex items-center gap-2 px-5 py-3 text-sm transition-colors ${
                      activeCategory === cat.key
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    {cat.count && (
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        activeCategory === cat.key
                          ? 'bg-primary/20 text-primary'
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        {cat.count} new
                      </span>
                    )}
                    {activeCategory === cat.key && (
                      <motion.div
                        layoutId="category-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Email list */}
              <div className="flex-1 overflow-y-auto">
                {filteredEmails.map((email, i) => {
                  const isRead = readIds.has(email.id);
                  const isStarred = starredIds.has(email.id);

                  return (
                    <motion.div
                      key={email.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => openEmail(email)}
                      className={`group flex cursor-pointer items-center border-b border-border/50 px-4 py-2 transition-colors hover:shadow-sm ${
                        isRead ? 'bg-transparent' : 'bg-card/60'
                      } hover:bg-secondary/40`}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        onClick={e => e.stopPropagation()}
                        className="mr-3 h-4 w-4 shrink-0 rounded border-border accent-primary"
                      />

                      {/* Star */}
                      <button
                        onClick={e => toggleStar(e, email.id)}
                        className="mr-3 shrink-0"
                      >
                        <Star className={`h-4 w-4 transition-colors ${
                          isStarred ? 'fill-warning text-warning' : 'text-muted-foreground/40 hover:text-warning/60'
                        }`} />
                      </button>

                      {/* Sender */}
                      <span className={`w-40 shrink-0 truncate text-sm ${
                        isRead ? 'text-muted-foreground' : 'font-bold text-foreground'
                      }`}>
                        {email.sender}
                      </span>

                      {/* Subject + Preview */}
                      <div className="mx-3 flex min-w-0 flex-1 items-center gap-1">
                        <span className={`shrink-0 text-sm ${
                          isRead ? 'text-muted-foreground' : 'font-bold text-foreground'
                        }`}>
                          {email.subject}
                        </span>
                        <span className="truncate text-sm text-muted-foreground/60">
                          {' - '}{email.preview}
                        </span>
                      </div>

                      {/* Attachment */}
                      {email.hasAttachment && (
                        <div className="mr-3 flex shrink-0 items-center gap-1 rounded bg-secondary px-2 py-0.5">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">{email.attachmentName}</span>
                        </div>
                      )}

                      {/* Date */}
                      <span className={`shrink-0 text-xs ${
                        isRead ? 'text-muted-foreground' : 'font-bold text-foreground'
                      }`}>
                        {email.date}
                      </span>

                      {/* Hover actions */}
                      <div className="ml-2 hidden shrink-0 items-center gap-1 group-hover:flex">
                        <button className="rounded p-1 hover:bg-secondary"><Archive className="h-3.5 w-3.5 text-muted-foreground" /></button>
                        <button className="rounded p-1 hover:bg-secondary"><Trash2 className="h-3.5 w-3.5 text-muted-foreground" /></button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Email Detail View */
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Detail toolbar */}
              <div className="flex items-center gap-2 border-b border-border px-4 py-2">
                <button onClick={closeEmail} className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="rounded p-1.5 text-muted-foreground hover:bg-secondary"><Archive className="h-4 w-4" /></button>
                <button className="rounded p-1.5 text-muted-foreground hover:bg-secondary"><Trash2 className="h-4 w-4" /></button>
                <button className="rounded p-1.5 text-muted-foreground hover:bg-secondary"><Mail className="h-4 w-4" /></button>
                <div className="flex-1" />
                <span className="text-xs text-muted-foreground">
                  {INBOX_EMAILS.findIndex(e => e.id === selectedEmail.id) + 1} of {INBOX_EMAILS.length}
                </span>
              </div>

              {/* Email content */}
              <div className="relative flex-1 overflow-y-auto p-6">
                {/* Analysis result banner (if analyzed) */}
                <AnimatePresence>
                  {analysisResult && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-4 flex items-center gap-3 rounded-lg border p-3 ${
                        analysisResult.classification === 'phishing'
                          ? 'border-threat/30 bg-threat/10'
                          : analysisResult.classification === 'suspicious'
                          ? 'border-suspicious/30 bg-suspicious/10'
                          : 'border-safe/30 bg-safe/10'
                      }`}
                    >
                      <Shield className={`h-5 w-5 ${
                        analysisResult.classification === 'phishing' ? 'text-threat'
                          : analysisResult.classification === 'suspicious' ? 'text-suspicious' : 'text-safe'
                      }`} />
                      <div className="flex-1">
                        <p className={`text-sm font-bold uppercase ${
                          analysisResult.classification === 'phishing' ? 'text-threat'
                            : analysisResult.classification === 'suspicious' ? 'text-suspicious' : 'text-safe'
                        }`}>
                          {analysisResult.classification} — {analysisResult.score}% Risk
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {analysisResult.threats.length} threat indicator{analysisResult.threats.length !== 1 ? 's' : ''} found
                        </p>
                      </div>
                      <button
                        onClick={goToFullAnalysis}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/80"
                      >
                        Full Report
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Analyzing spinner */}
                {analyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3"
                  >
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-sm text-primary">Scanning email for phishing indicators...</span>
                  </motion.div>
                )}

                {/* Subject */}
                <h2 className="mb-4 text-xl font-semibold text-foreground">{selectedEmail.subject}</h2>

                {/* Sender info */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                    {selectedEmail.sender[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{selectedEmail.sender}</span>
                      <span className="text-xs text-muted-foreground">&lt;{selectedEmail.email}&gt;</span>
                    </div>
                    <p className="text-xs text-muted-foreground">to me · {selectedEmail.date}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{selectedEmail.time}</span>
                </div>

                {/* Body */}
                <div className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                  {selectedEmail.body}
                </div>

                {/* Attachment */}
                {selectedEmail.hasAttachment && (
                  <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{selectedEmail.attachmentName}</span>
                  </div>
                )}

                {/* PhishGuard Analysis Popup */}
                <AnimatePresence>
                  {showAnalysisPopup && !analyzing && !analysisResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="fixed bottom-6 right-6 z-50 w-80 overflow-hidden rounded-xl border border-primary/30 bg-card shadow-2xl shadow-primary/10"
                    >
                      <div className="flex items-center gap-2 bg-primary/10 px-4 py-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="text-sm font-bold text-primary">PhishGuard</span>
                        <button
                          onClick={() => setShowAnalysisPopup(false)}
                          className="ml-auto rounded p-0.5 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="mb-1 text-sm font-medium text-foreground">Scan this email?</p>
                        <p className="mb-4 text-xs text-muted-foreground">
                          PhishGuard will analyze this email for phishing indicators, suspicious links, and social engineering patterns.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={runAnalysis}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/80"
                          >
                            <Shield className="h-3.5 w-3.5" />
                            Analyze
                          </button>
                          <button
                            onClick={() => setShowAnalysisPopup(false)}
                            className="rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
