import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User } from 'lucide-react';
import type { PhishingResult } from '@/lib/phishing-engine';

interface AIExplainerProps {
  result: PhishingResult | null;
}

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

function generateResponse(question: string, result: PhishingResult): string {
  const q = question.toLowerCase();
  const r = result;

  if (q.includes('why') && (q.includes('phishing') || q.includes('dangerous') || q.includes('threat') || q.includes('flagged'))) {
    if (r.classification === 'safe') return 'This message appears legitimate. No significant phishing indicators were found.';
    const reasons = r.threats.map(t => `• ${t.title}: ${t.description}`).join('\n');
    return `This is flagged as ${r.classification} (${r.score}% risk) because:\n\n${reasons}\n\nThe attack uses ${r.dna.psychologicalTrigger.toLowerCase()} tactics targeting ${r.dna.targetCategory.toLowerCase()}.`;
  }

  if (q.includes('safe') && q.includes('click')) {
    if (r.classification === 'safe') return 'Based on our analysis, this appears safe. However, always verify the sender before clicking links.';
    return `⚠️ Do NOT click any links in this message. Our analysis detected ${r.threats.length} threat indicator(s). The links may lead to credential harvesting pages or malware downloads.`;
  }

  if (q.includes('what') && (q.includes('do') || q.includes('should'))) {
    if (r.classification === 'safe') return 'No action needed. This message appears legitimate.';
    return '🛡️ Recommended actions:\n\n1. Do NOT click any links or download attachments\n2. Report this to your IT/security team\n3. Mark as phishing in your email client\n4. If you already clicked a link, change your passwords and enable 2FA immediately';
  }

  if (q.includes('dna') || q.includes('type') || q.includes('attack')) {
    return `🧬 Attack Profile:\n\n• Type: ${r.dna.attackType}\n• Trigger: ${r.dna.psychologicalTrigger}\n• Target: ${r.dna.targetCategory}\n• Complexity: ${r.dna.complexityLevel}\n• Techniques: ${r.dna.techniques.join(', ')}`;
  }

  if (q.includes('score') || q.includes('confidence')) {
    return `📊 Risk score: ${r.score}% (${r.classification}).\n\nCalculated from ${r.threats.length} detected threat indicators including ${r.threats.map(t => t.title).join(', ')}.`;
  }

  if (r.classification === 'safe') return 'This message appears safe. Our engine checked for urgency language, sensitive data requests, suspicious URLs, and brand impersonation — none were found. Always stay vigilant with unsolicited messages.';

  return `This ${r.classification} message has a ${r.score}% risk score. It uses ${r.dna.attackType.toLowerCase()} tactics with ${r.dna.psychologicalTrigger.toLowerCase()} triggers targeting ${r.dna.targetCategory.toLowerCase()}.\n\nTry asking:\n• "Why is this phishing?"\n• "Is it safe to click?"\n• "What should I do?"`;
}

export default function AIExplainer({ result }: AIExplainerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
  }, [result]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const handleAsk = () => {
    if (!input.trim() || !result) return;
    const q = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);

    setTimeout(() => {
      const response = generateResponse(q, result);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 400);
  };

  return (
    <div className="glass-panel overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
        <Bot className="h-4 w-4 text-primary" />
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          AI Explainer
        </span>
      </div>

      <div ref={chatRef} className="h-40 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-xs italic text-muted-foreground">
            {result ? 'Ask anything about this threat...' : 'Analyze an email or URL first...'}
          </p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? '' : ''}`}>
              <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded ${
                msg.role === 'user' ? 'bg-primary/10' : 'bg-secondary'
              }`}>
                {msg.role === 'user' ? (
                  <User className="h-3 w-3 text-primary" />
                ) : (
                  <Bot className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  {msg.role === 'user' ? 'You' : 'PhishGuard AI'}
                </p>
                <p className="whitespace-pre-line text-xs leading-relaxed text-foreground">
                  {msg.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex border-t border-border/50">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
          placeholder="Ask a question..."
          disabled={!result}
          className="flex-1 bg-transparent px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none disabled:opacity-50"
        />
        <button
          onClick={handleAsk}
          disabled={!result || !input.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 font-mono text-[10px] font-bold text-primary transition-colors hover:bg-primary/10 disabled:opacity-30"
        >
          <Send className="h-3 w-3" />
          ASK
        </button>
      </div>
    </div>
  );
}
