// PhishGuard Extension - Popup Logic

let currentMode = 'email';
let currentResult = null;
let scanHistory = [];

// Load history from storage
try { scanHistory = JSON.parse(localStorage.getItem('pg-history') || '[]'); } catch(e) {}

// Sample phishing templates
const SAMPLES = {
  email: [
    `Subject: URGENT: Your Account Has Been Compromised!\n\nDear Customer,\n\nWe detected unusual activity on your account. Your account has been temporarily suspended due to unauthorized access.\n\nYou must verify your identity immediately to restore access. Click the link below to confirm your account:\n\nhttps://secure-paypal-verify.tk/login\n\nFailure to verify within 24 hours will result in permanent account closure.\n\nEnter your password and credit card information to complete verification.\n\nPayPal Security Team`,
    `Congratulations! Your Free Typing Job Account is Ready & Login Detail - Start Earning Today!\n\nDigital Online Works <no-reply@digitalonlineworks.com>\n\nYou have been selected as a lucky winner for our exclusive offer. Claim your prize by clicking the link below and enter your bank account details:\n\nhttps://DigitalOnlineWorks.com/dashboard.html\n\nThis is a limited time offer. Act now before it expires!`,
    `Dear User,\n\nYour Netflix subscription payment failed. Update your payment method immediately or your account will be terminated.\n\nClick here to verify: https://netflix-billing-update.xyz/payment\n\nEnter your credit card and billing information to continue your subscription.\n\nThis is your final warning. Failure to update within 48 hours will result in legal action.\n\nNetflix Support`,
  ],
  url: [
    'https://paypal-secure-login.tk/verify',
    'https://192.168.1.100/amazon-login',
    'https://bit.ly/3xFakeLink',
  ]
};

// Tab switching
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    if (tab.dataset.tab === 'history') renderHistory();
    if (tab.dataset.tab === 'inbox') renderInbox();
  });
});

// Mode switching
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
    document.getElementById('email-input').classList.toggle('hidden', currentMode !== 'email');
    document.getElementById('url-input').classList.toggle('hidden', currentMode !== 'url');
    currentResult = null;
    renderResults();
  });
});

// Sample button
document.getElementById('sample-btn').addEventListener('click', () => {
  const samples = SAMPLES[currentMode];
  const sample = samples[Math.floor(Math.random() * samples.length)];
  if (currentMode === 'email') {
    document.getElementById('email-input').value = sample;
  } else {
    document.getElementById('url-input').value = sample;
  }
});

// Analyze
document.getElementById('analyze-btn').addEventListener('click', () => {
  const input = currentMode === 'email'
    ? document.getElementById('email-input').value
    : document.getElementById('url-input').value;
  if (!input.trim()) return;

  const btn = document.getElementById('analyze-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="scanning-dot">●</span> Scanning...';

  setTimeout(() => {
    currentResult = analyzeText(input, currentMode);
    // Save to history
    scanHistory.unshift({ input: input.slice(0, 100), mode: currentMode, result: currentResult, time: Date.now() });
    if (scanHistory.length > 30) scanHistory.pop();
    localStorage.setItem('pg-history', JSON.stringify(scanHistory));

    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> ANALYZE`;
    renderResults();
    resetAIChat();
  }, 1200);
});

// Render results
function renderResults() {
  const panel = document.getElementById('results-panel');
  if (!currentResult) {
    panel.innerHTML = `<div class="empty-state"><div class="empty-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><p class="empty-text">Paste an email or URL and click Analyze</p></div>`;
    return;
  }

  const r = currentResult;
  const cls = r.classification;
  const clr = cls === 'phishing' ? 'var(--threat)' : cls === 'suspicious' ? 'var(--suspicious)' : 'var(--safe)';
  const icon = cls === 'phishing' ? '⚠' : cls === 'safe' ? '✓' : '⚡';

  // Build gauge SVG
  const gaugeAngle = (r.score / 100) * 180;
  const gaugeHTML = buildGauge(r.score, clr);

  // Description based on analysis
  const desc = generateDescription(r);

  let html = `
    <div class="score-card ${cls}">
      <div class="score-top">
        <div class="gauge-container">${gaugeHTML}</div>
        <div class="score-info">
          <div class="classification-badge ${cls}">${icon} ${cls.toUpperCase()}</div>
          <div class="confidence-text">${r.score}% confidence · ${r.dna.attackType}</div>
          <div class="description-text">${desc}</div>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${r.score}%;background:${clr}"></div>
      </div>
    </div>

    <div class="result-tabs">
      <button class="result-tab active" data-rtab="analysis">● Analysis</button>
      <button class="result-tab" data-rtab="dna">🧬 Phishing DNA</button>
      <button class="result-tab" data-rtab="timeline">⚡ Attack Timeline</button>
    </div>

    <div id="rsection-analysis" class="result-section active">
      ${renderAnalysisSection(r)}
    </div>
    <div id="rsection-dna" class="result-section">
      ${renderDNASection(r)}
    </div>
    <div id="rsection-timeline" class="result-section">
      ${renderTimelineSection(r)}
    </div>
  `;

  panel.innerHTML = html;

  // Tab switching for results
  panel.querySelectorAll('.result-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      panel.querySelectorAll('.result-tab').forEach(t => t.classList.remove('active'));
      panel.querySelectorAll('.result-section').forEach(s => s.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`rsection-${tab.dataset.rtab}`).classList.add('active');
    });
  });
}

function buildGauge(score, color) {
  const r = 45;
  const circumference = Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  return `
    <svg viewBox="0 0 120 70" class="gauge-svg">
      <path d="M 10 65 A 45 45 0 0 1 110 65" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8" stroke-linecap="round"/>
      <path d="M 10 65 A 45 45 0 0 1 110 65" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"
        stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" style="transition: stroke-dashoffset 1s ease"/>
      <text x="60" y="52" text-anchor="middle" fill="${color}" font-family="'JetBrains Mono',monospace" font-size="24" font-weight="800">${score}</text>
      <text x="60" y="66" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="'JetBrains Mono',monospace" font-size="7" letter-spacing="2">RISK SCORE</text>
    </svg>`;
}

function generateDescription(r) {
  if (r.classification === 'safe') return 'No significant phishing indicators detected. This appears to be a legitimate message.';
  const types = r.threats.map(t => t.title.toLowerCase());
  if (types.includes('brand impersonation')) return `This message impersonates a known brand and uses ${r.dna.psychologicalTrigger.toLowerCase()} tactics to steal ${r.dna.targetCategory.toLowerCase()} data.`;
  if (r.classification === 'phishing') return `This is a ${r.dna.attackType.toLowerCase()} attempt using ${r.dna.psychologicalTrigger.toLowerCase()} to trick victims into revealing ${r.dna.targetCategory.toLowerCase()} information.`;
  return `Some suspicious elements detected. Exercise caution with this message.`;
}

function renderAnalysisSection(r) {
  let html = '';
  if (r.threats.length > 0) {
    html += `<div class="indicators-title">THREAT INDICATORS</div><div class="indicators-grid">`;
    r.threats.forEach(t => {
      html += `<div class="indicator-item"><span class="indicator-dot ${t.severity}"></span>${t.title}</div>`;
    });
    html += `</div>`;

    html += `<div class="threats-title">DETECTED THREATS</div>`;
    r.threats.forEach(t => {
      html += `
        <div class="threat-card">
          <div class="threat-card-header">
            <span class="threat-card-title">${t.title}</span>
            <span class="threat-severity ${t.severity}">${t.severity.toUpperCase()}</span>
          </div>
          <div class="threat-card-desc">${t.description}</div>
          <div class="threat-evidence">"${t.evidence}"</div>
        </div>`;
    });
  } else {
    html += `<div style="text-align:center;padding:30px;color:var(--safe)">✓ No threats detected</div>`;
  }
  return html;
}

function renderDNASection(r) {
  const d = r.dna;
  let html = `
    <div class="dna-grid">
      <div class="dna-item"><div class="dna-label">ATTACK TYPE</div><div class="dna-value">${d.attackType}</div></div>
      <div class="dna-item"><div class="dna-label">PSYCHOLOGICAL TRIGGER</div><div class="dna-value">${d.psychologicalTrigger}</div></div>
      <div class="dna-item"><div class="dna-label">TARGET CATEGORY</div><div class="dna-value">${d.targetCategory}</div></div>
      <div class="dna-item"><div class="dna-label">COMPLEXITY</div><div class="dna-value" style="text-transform:capitalize">${d.complexityLevel}</div></div>
    </div>`;
  if (d.techniques.length > 0) {
    html += `<div class="dna-techniques"><div class="dna-label">TECHNIQUES USED</div><div class="technique-tags">`;
    d.techniques.forEach(t => { html += `<span class="technique-tag">${t}</span>`; });
    html += `</div></div>`;
  }
  return html;
}

function renderTimelineSection(r) {
  if (r.timeline.length === 0) return `<div style="text-align:center;padding:30px;color:var(--fg-muted)">No attack timeline for safe messages</div>`;
  let html = `<div class="timeline">`;
  r.timeline.forEach(s => {
    html += `
      <div class="timeline-step">
        <div class="timeline-dot ${s.risk}"></div>
        <div class="timeline-title">Step ${s.step}: ${s.title}</div>
        <div class="timeline-desc">${s.description}</div>
      </div>`;
  });
  html += `</div>`;
  return html;
}

// AI Explainer
function resetAIChat() {
  const chat = document.getElementById('ai-chat');
  chat.innerHTML = '<p class="ai-placeholder">Ask anything about this threat...</p>';
}

function generateAIResponse(question) {
  if (!currentResult) return "Please analyze an email or URL first.";
  const r = currentResult;
  const q = question.toLowerCase();

  if (q.includes('why') && (q.includes('phishing') || q.includes('dangerous') || q.includes('threat'))) {
    if (r.classification === 'safe') return "This message appears legitimate. No significant phishing indicators were found.";
    const reasons = r.threats.map(t => `• ${t.title}: ${t.description}`).join('\n');
    return `This is flagged as ${r.classification} (${r.score}% risk) because:\n\n${reasons}\n\nThe attack uses ${r.dna.psychologicalTrigger.toLowerCase()} tactics targeting ${r.dna.targetCategory.toLowerCase()}.`;
  }
  if (q.includes('safe') && q.includes('click')) {
    if (r.classification === 'safe') return "Based on our analysis, this appears safe. However, always verify the sender.";
    return "⚠️ Do NOT click any links in this message. Our analysis detected ${r.threats.length} threat indicator(s). The links may lead to credential harvesting or malware.";
  }
  if (q.includes('what') && q.includes('do')) {
    if (r.classification === 'safe') return "No action needed. This message appears legitimate.";
    return "Recommended actions:\n1. Do NOT click any links or download attachments\n2. Report this to your IT/security team\n3. Mark as phishing in your email client\n4. If you already clicked a link, change your passwords and enable 2FA immediately";
  }
  if (q.includes('dna') || q.includes('type') || q.includes('attack')) {
    return `Attack Profile:\n• Type: ${r.dna.attackType}\n• Trigger: ${r.dna.psychologicalTrigger}\n• Target: ${r.dna.targetCategory}\n• Complexity: ${r.dna.complexityLevel}\n• Techniques: ${r.dna.techniques.join(', ')}`;
  }
  if (q.includes('score') || q.includes('confidence')) {
    return `Risk score: ${r.score}% (${r.classification}). This is calculated from ${r.threats.length} detected threat indicators including ${r.threats.map(t=>t.title).join(', ')}.`;
  }
  // Default
  if (r.classification === 'safe') return "This message appears safe. Our engine checked for urgency language, sensitive data requests, suspicious URLs, and brand impersonation — none were found.";
  return `This ${r.classification} message (${r.score}% risk) uses ${r.dna.attackType.toLowerCase()} tactics. It targets ${r.dna.targetCategory.toLowerCase()} through ${r.dna.psychologicalTrigger.toLowerCase()}. ${r.threats.length} threat indicators were detected. Ask me specific questions like "Why is this phishing?" or "Is it safe to click?"`;
}

document.getElementById('ai-ask-btn').addEventListener('click', askAI);
document.getElementById('ai-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') askAI(); });

function askAI() {
  const input = document.getElementById('ai-input');
  const q = input.value.trim();
  if (!q) return;

  const chat = document.getElementById('ai-chat');
  if (chat.querySelector('.ai-placeholder')) chat.innerHTML = '';

  chat.innerHTML += `<div class="ai-msg user"><div class="label">YOU</div>${escapeHTML(q)}</div>`;
  input.value = '';

  setTimeout(() => {
    const response = generateAIResponse(q);
    chat.innerHTML += `<div class="ai-msg bot"><div class="label">PHISHGUARD AI</div>${escapeHTML(response).replace(/\n/g, '<br>')}</div>`;
    chat.scrollTop = chat.scrollHeight;
  }, 500);
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Inbox (simulated)
const INBOX_EMAILS = [
  { sender: 'PayPal Security', subject: 'URGENT: Your account has been compromised - verify now', body: 'Dear Customer,\n\nWe detected unauthorized access to your PayPal account. Your account has been temporarily suspended.\n\nClick here to verify your identity immediately: https://paypal-secure-verify.tk/login\n\nEnter your password and credit card to restore access.\n\nFailure to verify within 24 hours will result in permanent closure.\n\nPayPal Security Team', time: '2 min ago' },
  { sender: 'Google Workspace', subject: 'Your storage is 95% full - upgrade now', body: 'Hi there,\n\nYour Google Workspace storage is nearly full at 95%. Consider upgrading your plan to continue using all features.\n\nVisit https://workspace.google.com/pricing to see available plans.\n\nGoogle Workspace Team', time: '15 min ago' },
  { sender: 'Netflix Billing', subject: 'Payment failed - update your billing information immediately', body: 'Dear User,\n\nYour Netflix subscription payment failed. Update your payment method immediately or your account will be terminated.\n\nClick here to verify: https://netflix-billing-update.xyz/payment\n\nEnter your credit card and billing information.\n\nThis is your final warning. Failure to update within 48 hours will result in legal action.\n\nNetflix Support', time: '1 hr ago' },
  { sender: 'Amazon Orders', subject: 'Your order #302-1234567 has shipped', body: 'Hello,\n\nGreat news! Your order has shipped and is on its way.\n\nOrder #302-1234567\nEstimated delivery: March 25-27\n\nTrack your package at https://amazon.com/orders\n\nThank you for shopping with Amazon.', time: '3 hr ago' },
  { sender: 'Prize Winners Club', subject: 'Congratulations! You have won $1,000,000!', body: 'CONGRATULATIONS!!!\n\nYou have been selected as a lucky winner of our international lottery!\n\nYou have won $1,000,000 (ONE MILLION DOLLARS)!\n\nClaim your prize now by clicking: https://prize-winners-club.xyz/claim\n\nEnter your bank account details to receive the transfer.\n\nThis is a limited time exclusive offer. Act now!\n\nPrize Committee', time: '5 hr ago' },
];

function renderInbox() {
  const list = document.getElementById('inbox-list');
  list.innerHTML = '';

  INBOX_EMAILS.forEach((email, i) => {
    const result = analyzeText(email.body, 'email');
    const cls = result.classification;
    const itemCls = cls === 'phishing' ? 'threat' : cls === 'suspicious' ? 'suspicious-mail' : 'safe-mail';
    const dotColor = cls === 'phishing' ? 'var(--threat)' : cls === 'suspicious' ? 'var(--suspicious)' : 'var(--safe)';

    const item = document.createElement('div');
    item.className = `inbox-item ${itemCls}`;
    item.innerHTML = `
      <div class="inbox-status" style="background:${dotColor}"></div>
      <div class="inbox-content">
        <div class="inbox-sender">${escapeHTML(email.sender)}</div>
        <div class="inbox-subject">${escapeHTML(email.subject)}</div>
      </div>
      <div class="inbox-meta">
        <div class="inbox-time">${email.time}</div>
        <div class="inbox-badge ${cls}">${cls.toUpperCase()} ${result.score}%</div>
      </div>
    `;

    item.addEventListener('click', () => {
      // Switch to analyze tab with this email
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.querySelector('[data-tab="analyze"]').classList.add('active');
      document.getElementById('tab-analyze').classList.add('active');

      // Set mode to email and fill in
      currentMode = 'email';
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('[data-mode="email"]').classList.add('active');
      document.getElementById('email-input').classList.remove('hidden');
      document.getElementById('url-input').classList.add('hidden');
      document.getElementById('email-input').value = email.body;

      // Auto-analyze
      currentResult = result;
      renderResults();
      resetAIChat();
    });

    list.appendChild(item);
  });
}

// History
function renderHistory() {
  const list = document.getElementById('history-list');
  if (scanHistory.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:30px;color:var(--fg-muted)">No scans yet</div>';
    return;
  }
  list.innerHTML = '';
  scanHistory.forEach(h => {
    const clr = h.result.classification === 'phishing' ? 'var(--threat)' : h.result.classification === 'suspicious' ? 'var(--suspicious)' : 'var(--safe)';
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <span class="history-input">${escapeHTML(h.input)}</span>
      <span class="history-result" style="color:${clr}">${h.result.classification.toUpperCase()} ${h.result.score}%</span>
    `;
    list.appendChild(item);
  });
}

// Init inbox
renderInbox();
