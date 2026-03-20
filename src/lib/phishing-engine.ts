// Phishing Detection Engine - Client-side heuristic analysis

export interface PhishingResult {
  score: number; // 0-100
  classification: 'safe' | 'suspicious' | 'phishing';
  threats: ThreatIndicator[];
  dna: PhishingDNA;
  timeline: AttackTimelineStep[];
}

export interface ThreatIndicator {
  type: 'keyword' | 'url' | 'tone' | 'metadata' | 'pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  evidence: string;
}

export interface PhishingDNA {
  attackType: string;
  psychologicalTrigger: string;
  targetCategory: string;
  complexityLevel: 'basic' | 'intermediate' | 'advanced' | 'sophisticated';
  techniques: string[];
}

export interface AttackTimelineStep {
  step: number;
  title: string;
  description: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
}

const URGENCY_WORDS = [
  'urgent', 'immediately', 'right away', 'asap', 'expire', 'suspended',
  'verify now', 'act now', 'limited time', 'within 24 hours', 'within 48 hours',
  'account will be', 'failure to', 'must respond', 'action required',
  'your account has been', 'unauthorized', 'detected unusual',
];

const THREAT_WORDS = [
  'suspended', 'terminated', 'closed', 'blocked', 'locked',
  'compromised', 'breach', 'unauthorized access', 'illegal',
  'violation', 'penalty', 'legal action', 'law enforcement',
];

const SENSITIVE_REQUESTS = [
  'password', 'credit card', 'social security', 'ssn', 'bank account',
  'pin number', 'login credentials', 'verify your identity',
  'confirm your account', 'update your payment', 'billing information',
  'click here to verify', 'click the link below', 'enter your',
];

const REWARD_WORDS = [
  'congratulations', 'you have won', 'prize', 'reward', 'gift card',
  'lottery', 'inheritance', 'million dollars', 'free', 'claim your',
  'selected', 'lucky winner', 'exclusive offer',
];

const SUSPICIOUS_URL_PATTERNS = [
  /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // IP address
  /@/, // @ in URL
  /bit\.ly|tinyurl|goo\.gl|t\.co|shorturl|tiny\.cc/, // URL shorteners
  /\.(tk|ml|ga|cf|gq|xyz|top|club|online|site|work|click)\b/, // suspicious TLDs
  /paypal.*\.(?!paypal\.com)/, // typosquatting
  /google.*\.(?!google\.com)/,
  /apple.*\.(?!apple\.com)/,
  /microsoft.*\.(?!microsoft\.com)/,
  /amazon.*\.(?!amazon\.com)/,
  /bank.*\.(tk|ml|ga|cf|xyz)/,
  /-{2,}/, // multiple hyphens
  /[a-z0-9]{20,}\./, // very long subdomain
  /https?:\/\/[^/]*\.[^/]*\.[^/]*\.[^/]*\./, // too many subdomains
];

const BRAND_NAMES = ['paypal', 'amazon', 'google', 'apple', 'microsoft', 'netflix', 'bank', 'wells fargo', 'chase', 'citibank'];

function findMatches(text: string, patterns: string[]): string[] {
  const lower = text.toLowerCase();
  return patterns.filter(p => lower.includes(p));
}

function analyzeUrls(text: string): { urls: string[]; threats: ThreatIndicator[] } {
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
  const urls = text.match(urlRegex) || [];
  const threats: ThreatIndicator[] = [];

  for (const url of urls) {
    for (const pattern of SUSPICIOUS_URL_PATTERNS) {
      if (pattern.test(url)) {
        threats.push({
          type: 'url',
          severity: 'high',
          title: 'Suspicious URL Pattern',
          description: `The URL "${url.slice(0, 60)}..." matches a known phishing pattern.`,
          evidence: url,
        });
        break;
      }
    }

    // Check for brand impersonation in URL
    for (const brand of BRAND_NAMES) {
      if (url.toLowerCase().includes(brand) && !url.toLowerCase().includes(`${brand}.com`)) {
        threats.push({
          type: 'url',
          severity: 'critical',
          title: 'Brand Impersonation',
          description: `URL contains "${brand}" but does not point to the official domain.`,
          evidence: url,
        });
      }
    }
  }

  return { urls, threats };
}

function determineAttackType(threats: ThreatIndicator[], urgency: string[], sensitive: string[], rewards: string[]): string {
  if (rewards.length > 0) return 'Prize/Reward Scam';
  if (sensitive.some(s => s.includes('password') || s.includes('login'))) return 'Credential Harvesting';
  if (sensitive.some(s => s.includes('credit card') || s.includes('payment') || s.includes('billing'))) return 'Financial Fraud';
  if (threats.some(t => t.title === 'Brand Impersonation')) return 'Brand Impersonation';
  if (urgency.length > 2) return 'Urgency-Based Social Engineering';
  return 'Generic Phishing';
}

function determinePsychologicalTrigger(urgency: string[], threatWords: string[], rewards: string[]): string {
  if (rewards.length > 0) return 'Greed / Reward';
  if (threatWords.length > 0) return 'Fear / Threat';
  if (urgency.length > 0) return 'Urgency / Pressure';
  return 'Curiosity / Trust';
}

function determineTargetCategory(sensitive: string[]): string {
  if (sensitive.some(s => ['credit card', 'payment', 'billing', 'bank account'].some(k => s.includes(k)))) return 'Banking / Financial';
  if (sensitive.some(s => ['password', 'login', 'credentials'].some(k => s.includes(k)))) return 'Account Login / OTP';
  return 'Personal Information';
}

function generateTimeline(classification: string, dna: PhishingDNA): AttackTimelineStep[] {
  if (classification === 'safe') return [];

  const steps: AttackTimelineStep[] = [
    {
      step: 1,
      title: 'Initial Contact',
      description: `Attacker sends ${dna.attackType.toLowerCase()} email designed to trigger ${dna.psychologicalTrigger.toLowerCase()}.`,
      risk: 'low',
    },
    {
      step: 2,
      title: 'Engagement Hook',
      description: 'Victim reads the message and feels compelled to act due to emotional manipulation.',
      risk: 'medium',
    },
    {
      step: 3,
      title: 'Action Trigger',
      description: 'Victim clicks the malicious link or begins entering sensitive information.',
      risk: 'high',
    },
    {
      step: 4,
      title: 'Data Capture',
      description: `Attacker captures ${dna.targetCategory.toLowerCase()} data through fake form or redirect.`,
      risk: 'critical',
    },
    {
      step: 5,
      title: 'Exploitation',
      description: 'Stolen credentials are used for unauthorized access, financial theft, or sold on dark web.',
      risk: 'critical',
    },
  ];

  return steps;
}

export function analyzeText(input: string, mode: 'email' | 'url'): PhishingResult {
  const threats: ThreatIndicator[] = [];
  let score = 0;

  if (mode === 'url') {
    const { threats: urlThreats } = analyzeUrls(input);
    threats.push(...urlThreats);
    score += urlThreats.length * 25;

    // Basic URL-only checks
    if (SUSPICIOUS_URL_PATTERNS.some(p => p.test(input))) {
      score += 30;
    }

    if (score === 0 && input.startsWith('https://')) {
      score = 5;
    } else if (score === 0) {
      score = 15;
      threats.push({
        type: 'url',
        severity: 'low',
        title: 'No HTTPS',
        description: 'URL does not use secure HTTPS protocol.',
        evidence: input,
      });
    }
  } else {
    // Email analysis
    const urgencyMatches = findMatches(input, URGENCY_WORDS);
    const threatMatches = findMatches(input, THREAT_WORDS);
    const sensitiveMatches = findMatches(input, SENSITIVE_REQUESTS);
    const rewardMatches = findMatches(input, REWARD_WORDS);
    const { threats: urlThreats } = analyzeUrls(input);

    if (urgencyMatches.length > 0) {
      score += Math.min(urgencyMatches.length * 12, 35);
      threats.push({
        type: 'tone',
        severity: urgencyMatches.length > 2 ? 'high' : 'medium',
        title: 'Urgency Language Detected',
        description: `Found ${urgencyMatches.length} urgency indicator(s) designed to pressure immediate action.`,
        evidence: urgencyMatches.join(', '),
      });
    }

    if (threatMatches.length > 0) {
      score += Math.min(threatMatches.length * 15, 30);
      threats.push({
        type: 'tone',
        severity: 'high',
        title: 'Threat Language Detected',
        description: 'Message uses threatening language to create fear.',
        evidence: threatMatches.join(', '),
      });
    }

    if (sensitiveMatches.length > 0) {
      score += Math.min(sensitiveMatches.length * 18, 40);
      threats.push({
        type: 'keyword',
        severity: 'critical',
        title: 'Sensitive Data Request',
        description: 'Message requests sensitive personal or financial information.',
        evidence: sensitiveMatches.join(', '),
      });
    }

    if (rewardMatches.length > 0) {
      score += Math.min(rewardMatches.length * 14, 30);
      threats.push({
        type: 'pattern',
        severity: 'high',
        title: 'Reward/Prize Bait',
        description: 'Message uses reward language common in scams.',
        evidence: rewardMatches.join(', '),
      });
    }

    threats.push(...urlThreats);
    score += urlThreats.length * 20;

    // Grammar/spelling heuristics
    const excessiveCaps = (input.match(/[A-Z]{4,}/g) || []).length;
    if (excessiveCaps > 2) {
      score += 10;
      threats.push({
        type: 'pattern',
        severity: 'medium',
        title: 'Excessive Capitalization',
        description: 'Unusual use of capital letters, common in phishing emails.',
        evidence: `${excessiveCaps} instances of excessive caps`,
      });
    }

    // Determine DNA
    var attackType = determineAttackType(threats, urgencyMatches, sensitiveMatches, rewardMatches);
    var psychologicalTrigger = determinePsychologicalTrigger(urgencyMatches, threatMatches, rewardMatches);
    var targetCategory = determineTargetCategory(sensitiveMatches);
  }

  score = Math.min(score, 98);

  const classification: PhishingResult['classification'] =
    score >= 60 ? 'phishing' : score >= 30 ? 'suspicious' : 'safe';

  const complexity = score >= 75 ? 'sophisticated' : score >= 50 ? 'advanced' : score >= 30 ? 'intermediate' : 'basic';

  const dna: PhishingDNA = {
    attackType: attackType! || 'URL-Based Phishing',
    psychologicalTrigger: psychologicalTrigger! || 'Curiosity / Trust',
    targetCategory: targetCategory! || 'General',
    complexityLevel: complexity,
    techniques: threats.map(t => t.title).filter((v, i, a) => a.indexOf(v) === i),
  };

  const timeline = generateTimeline(classification, dna);

  return { score, classification, threats, dna, timeline };
}

// History management
export interface ScanRecord {
  id: string;
  input: string;
  mode: 'email' | 'url';
  result: PhishingResult;
  timestamp: number;
}

const HISTORY_KEY = 'phishing-scan-history';

export function saveScan(input: string, mode: 'email' | 'url', result: PhishingResult): ScanRecord {
  const record: ScanRecord = {
    id: crypto.randomUUID(),
    input,
    mode,
    result,
    timestamp: Date.now(),
  };
  const history = getHistory();
  history.unshift(record);
  if (history.length > 50) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return record;
}

export function getHistory(): ScanRecord[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
