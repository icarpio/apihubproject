/**
 * translate.js — shared translation helper for API Hub
 */

const API = CONFIG.API_URL;

const LANG_LABELS = {
  en: '🇬🇧 EN',
  es: '🇪🇸 ES',
  it: '🇮🇹 IT',
  fr: '🇫🇷 FR',
};

async function translateTexts(texts, lang) {
  if (lang === 'en') return texts;
  const r = await fetch(`${API}/api/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts, target: lang }),
  });
  const data = await r.json();
  return data.translations;
}

function renderTranslateBar(containerId, onTranslate, activeLang = 'en') {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
    <div class="translate-bar">
      <span class="translate-label">🌐</span>
      ${Object.entries(LANG_LABELS).map(([code, label]) => `
        <button class="lang-btn ${code === activeLang ? 'active' : ''}" data-lang="${code}" onclick="handleLangClick(this)">${label}</button>
      `).join('')}
      <span class="translate-status" id="translate-status"></span>
    </div>`;
  window._onTranslate = onTranslate;
}

function handleLangClick(btn) {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const status = document.getElementById('translate-status');
  if (btn.dataset.lang !== 'en' && status) {
    status.textContent = 'Translating...';
    status.style.opacity = '1';
  }
  window._onTranslate && window._onTranslate(btn.dataset.lang);
  setTimeout(() => { if (status) status.style.opacity = '0'; }, 1800);
}

(function injectTranslateStyles() {
  if (document.getElementById('translate-bar-styles')) return;
  const style = document.createElement('style');
  style.id = 'translate-bar-styles';
  style.textContent = `
    .translate-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      flex-wrap: wrap;
      padding: 10px 16px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 100px;
      margin: 16px auto 0;
      width: fit-content;
      max-width: calc(100vw - 32px);
    }
    .translate-label {
      font-size: 1rem;
      opacity: 0.5;
      flex-shrink: 0;
    }
    .lang-btn {
      padding: 5px 14px;
      border-radius: 100px;
      border: 1px solid rgba(255,255,255,0.1);
      background: transparent;
      color: rgba(255,255,255,0.45);
      font-size: 0.78rem;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
      font-family: inherit;
      flex-shrink: 0;
    }
    .lang-btn:hover {
      border-color: rgba(255,255,255,0.3);
      color: rgba(255,255,255,0.8);
    }
    .lang-btn.active {
      background: rgba(255,255,255,0.12);
      border-color: rgba(255,255,255,0.35);
      color: #fff;
    }
    .translate-status {
      font-size: 0.72rem;
      opacity: 0;
      transition: opacity 0.3s;
      color: rgba(255,255,255,0.4);
      font-style: italic;
    }
    @media (max-width: 360px) {
      .lang-btn { padding: 4px 10px; font-size: 0.72rem; }
      .translate-bar { gap: 4px; padding: 8px 12px; }
    }
  `;
  document.head.appendChild(style);
})();
