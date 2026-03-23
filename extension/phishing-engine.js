// PhishGuard - Client-side Phishing Detection Engine

const URGENCY_WORDS = [
  'urgent', 'immediately', 'right away', 'asap', 'expire', 'suspended',
  'verify now', 'act now', 'limited time', 'within 24 hours', 'within 48 hours',
  'your account has been', 'unauthorized', 'detected unusual', 'action required',
  'failure to', 'must respond',
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
  /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
  /@/,
  /bit\.ly|tinyurl|goo\.gl|t\.co|shorturl|tiny\.cc/,
  /\.(tk|ml|ga|cf|gq|xyz|top|club|online|site|work|click)\b/,
  /paypal.*\.(?!paypal\.com)/,
  /google.*\.(?!google\.com)/,
  /apple.*\.(?!apple\.com)/,
  /microsoft.*\.(?!microsoft\.com)/,
  /amazon.*\.(?!amazon\.com)/,
  /-{2,}/,
  /[a-z0-9]{20,}\./,
  /https?:\/\/[^/]*\.[^/]*\.[^/]*\.[^/]*\./,
];

const BRAND_NAMES = ['paypal', 'amazon', 'google', 'apple', 'microsoft', 'netflix', 'bank', 'wells fargo', 'chase'];

function findMatches(text, patterns) {
  const lower = text.toLowerCase();
  return patterns.filter(p => lower.includes(p));
}

function analyzeUrls(text) {
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
  const urls = text.match(urlRegex) || [];
  const threats = [];

  for (const url of urls) {
    for (const pattern of SUSPICIOUS_URL_PATTERNS) {
      if (pattern.test(url)) {
        threats.push({ type: 'url', severity: 'high', title: 'Suspicious URL Pattern', description: `URL "${url.slice(0, 50)}..." matches a known phishing pattern.`, evidence: url });
        break;
      }
    }
    for (const brand of BRAND_NAMES) {
      if (url.toLowerCase().includes(brand) && !url.toLowerCase().includes(`${brand}.com`)) {
        threats.push({ type: 'url', severity: 'critical', title: 'Brand Impersonation', description: `URL contains "${brand}" but doesn't point to official domain.`, evidence: url });
      }
    }
  }
  return { urls, threats };
}

function analyzeText(input, mode) {
  const threats = [];
  let score = 0;

  if (mode === 'url') {
    const { threats: ut } = analyzeUrls(input);
    threats.push(...ut);
    score += ut.length * 25;
    if (SUSPICIOUS_URL_PATTERNS.some(p => p.test(input))) score += 30;
    if (score === 0 && input.startsWith('https://')) score = 5;
    else if (score === 0) {
      score = 15;
      threats.push({ type: 'url', severity: 'low', title: 'No HTTPS', description: 'URL does not use secure HTTPS.', evidence: input });
    }
  } else {
    const urgency = findMatches(input, URGENCY_WORDS);
    const threat = findMatches(input, THREAT_WORDS);
    const sensitive = findMatches(input, SENSITIVE_REQUESTS);
    const rewards = findMatches(input, REWARD_WORDS);
    const { threats: ut } = analyzeUrls(input);

    if (urgency.length > 0) {
      score += Math.min(urgency.length * 12, 35);
      threats.push({ type: 'tone', severity: urgency.length > 2 ? 'high' : 'medium', title: 'Urgency Language', description: `Found ${urgency.length} urgency indicator(s).`, evidence: urgency.join(', ') });
    }
    if (threat.length > 0) {
      score += Math.min(threat.length * 15, 30);
      threats.push({ type: 'tone', severity: 'high', title: 'Threat Language', description: 'Uses threatening language to create fear.', evidence: threat.join(', ') });
    }
    if (sensitive.length > 0) {
      score += Math.min(sensitive.length * 18, 40);
      threats.push({ type: 'keyword', severity: 'critical', title: 'Requests Sensitive Info', description: 'Requests sensitive personal or financial info.', evidence: sensitive.join(', ') });
    }
    if (rewards.length > 0) {
      score += Math.min(rewards.length * 14, 30);
      threats.push({ type: 'pattern', severity: 'high', title: 'Reward/Prize Bait', description: 'Uses reward language common in scams.', evidence: rewards.join(', ') });
    }
    threats.push(...ut);
    score += ut.length * 20;

    const caps = (input.match(/[A-Z]{4,}/g) || []).length;
    if (caps > 2) {
      score += 10;
      threats.push({ type: 'pattern', severity: 'medium', title: 'Excessive Capitalization', description: 'Unusual caps usage common in phishing.', evidence: `${caps} instances` });
    }
  }

  score = Math.min(score, 98);
  const classification = score >= 60 ? 'phishing' : score >= 30 ? 'suspicious' : 'safe';
  const complexity = score >= 75 ? 'sophisticated' : score >= 50 ? 'advanced' : score >= 30 ? 'intermediate' : 'basic';

  const urgency = findMatches(input, URGENCY_WORDS);
  const threat = findMatches(input, THREAT_WORDS);
  const sensitive = findMatches(input, SENSITIVE_REQUESTS);
  const rewards = findMatches(input, REWARD_WORDS);

  let attackType = 'Generic Phishing';
  if (rewards.length > 0) attackType = 'Prize/Reward Scam';
  else if (sensitive.some(s => s.includes('password') || s.includes('login'))) attackType = 'Credential Harvesting';
  else if (sensitive.some(s => s.includes('credit card') || s.includes('payment'))) attackType = 'Financial Fraud';
  else if (threats.some(t => t.title === 'Brand Impersonation')) attackType = 'Brand Impersonation';
  else if (urgency.length > 2) attackType = 'Urgency Social Engineering';

  let trigger = 'Curiosity / Trust';
  if (rewards.length > 0) trigger = 'Greed / Reward';
  else if (threat.length > 0) trigger = 'Fear / Threat';
  else if (urgency.length > 0) trigger = 'Urgency / Pressure';

  let target = 'Personal Information';
  if (sensitive.some(s => ['credit card', 'payment', 'billing', 'bank'].some(k => s.includes(k)))) target = 'Banking / Financial';
  else if (sensitive.some(s => ['password', 'login', 'credentials'].some(k => s.includes(k)))) target = 'Account Login / OTP';

  const dna = { attackType, psychologicalTrigger: trigger, targetCategory: target, complexityLevel: complexity, techniques: [...new Set(threats.map(t => t.title))] };

  const timeline = classification === 'safe' ? [] : [
    { step: 1, title: 'Initial Contact', description: `Attacker sends ${attackType.toLowerCase()} message to trigger ${trigger.toLowerCase()}.`, risk: 'low' },
    { step: 2, title: 'Engagement Hook', description: 'Victim reads the message and feels compelled to act.', risk: 'medium' },
    { step: 3, title: 'Action Trigger', description: 'Victim clicks malicious link or enters sensitive info.', risk: 'high' },
    { step: 4, title: 'Data Capture', description: `Attacker captures ${target.toLowerCase()} data through fake form.`, risk: 'critical' },
    { step: 5, title: 'Exploitation', description: 'Stolen data used for unauthorized access or sold on dark web.', risk: 'critical' },
  ];

  return { score, classification, threats, dna, timeline };
}
