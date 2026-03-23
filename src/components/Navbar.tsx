import { Link, useLocation } from 'react-router-dom';
import { Shield, BarChart3, Clock, Menu, X, Inbox, Download } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHistory } from '@/lib/phishing-engine';

const navItems = [
  { to: '/', label: 'Home', icon: Shield },
  { to: '/analyze', label: 'Analyze', icon: BarChart3 },
  { to: '/inbox', label: 'Inbox', icon: Inbox },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/extension', label: 'Extension', icon: Download },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const historyCount = getHistory().length;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 glow-primary">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <span className="font-mono text-xs font-bold tracking-tight text-foreground">
            PHISH<span className="text-primary">GUARD</span><span className="text-primary">.AI</span>
          </span>
          <span className="hidden sm:inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[9px] font-bold text-primary">
            v2 · DNA ENGINE
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 ${
                  active ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {label === 'History' && historyCount > 0 && (
                  <span className="text-[9px]">({historyCount})</span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-safe" />
          <span className="font-mono text-[10px] text-safe">LIVE</span>
        </div>

        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/50 bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    location.pathname === to
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
