// PhishGuard - Gmail Content Script
// Detects when a user opens an email in Gmail and shows analysis prompt

(function() {
  'use strict';

  let lastEmailHash = '';
  let banner = null;

  function createBanner(emailText) {
    if (banner) banner.remove();

    banner = document.createElement('div');
    banner.id = 'phishguard-banner';
    banner.innerHTML = `
      <div class="pg-banner-inner">
        <div class="pg-logo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2dd4a8" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>PhishGuard</span>
        </div>
        <div class="pg-message">Click to analyze this email for phishing threats</div>
        <button class="pg-analyze-btn" id="pg-analyze-trigger">Analyze</button>
        <button class="pg-dismiss" id="pg-dismiss">✕</button>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('pg-analyze-trigger').addEventListener('click', () => {
      // Store email text and open popup
      chrome.storage.local.set({ pendingEmail: emailText.slice(0, 5000) });
      banner.classList.add('pg-analyzing');
      banner.querySelector('.pg-message').textContent = 'Opening PhishGuard... Click the extension icon to see results.';
    });

    document.getElementById('pg-dismiss').addEventListener('click', () => {
      banner.remove();
      banner = null;
    });

    // Auto-hide after 15 seconds
    setTimeout(() => {
      if (banner) {
        banner.style.opacity = '0';
        setTimeout(() => { if (banner) banner.remove(); }, 300);
      }
    }, 15000);
  }

  function getEmailText() {
    // Try to get the currently open email body from Gmail DOM
    const emailBody = document.querySelector('.a3s.aiL') || document.querySelector('.ii.gt');
    if (emailBody) return emailBody.innerText || '';
    return '';
  }

  function checkForOpenEmail() {
    const text = getEmailText();
    if (text.length > 20) {
      const hash = text.slice(0, 200);
      if (hash !== lastEmailHash) {
        lastEmailHash = hash;
        createBanner(text);
      }
    }
  }

  // Poll for email changes (Gmail is an SPA)
  setInterval(checkForOpenEmail, 2000);
})();
