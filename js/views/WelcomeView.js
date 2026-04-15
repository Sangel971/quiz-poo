import { View } from './View.js';

/**
 * @class WelcomeView
 * Vue d'accueil : saisie du pseudo, validation, et aperçu TOP 3 du classement.
 */
export class WelcomeView extends View {
  constructor(app) {
    super(app);
  }

  /**
   * Valide le pseudo : 2-20 caractères, lettres/chiffres/espace/._-
   * @param {string} name
   * @returns {boolean}
   */
  validatePseudo(name) {
    return /^[a-zA-ZÀ-ÿ0-9 ._-]{2,20}$/.test(name.trim());
  }

  render() {
    return `
      <div class="welcome-view">

        <!-- Titre -->
        <div class="text-center">
          <div class="welcome-logo">⚖️</div>
          <h1 class="welcome-title">VRAI ou FAUX ?</h1>
          <p class="welcome-subtitle">Formation Contentieux Gérance</p>
          <p class="welcome-topic">Le recouvrement des loyers</p>
        </div>

        <!-- Formulaire pseudo -->
        <div class="glass-card welcome-card">
          <h2>Entrez votre pseudo</h2>

          <div class="pseudo-field">
            <span class="pseudo-icon">👤</span>
            <input
              id="pseudo-input"
              class="pseudo-input"
              type="text"
              placeholder="Votre prénom…"
              maxlength="20"
              autocomplete="off"
              spellcheck="false"
            />
          </div>
          <span id="input-hint" class="input-hint">
            Min. 2 caractères — lettres, chiffres, espace, . _ -
          </span>

          <button id="start-btn" class="btn-start" disabled>
            🚀 START
          </button>
        </div>

        <p class="questions-count text-center mt-2">
          <strong>20</strong> questions · Formation Gérance
        </p>

        <!-- TOP 3 classement -->
        <div class="glass-card leaderboard-preview mt-3" id="lb-preview-card">
          <div class="lb-preview-header">
            <span>🏆</span> Classement
          </div>
          <div id="lb-preview-content">
            <div class="lb-loading">Chargement…</div>
          </div>
        </div>

      </div>
    `;
  }

  async mount() {
    super.mount();
    this._loadLeaderboardPreview();
  }

  bindEvents() {
    const input = document.getElementById('pseudo-input');
    const btn   = document.getElementById('start-btn');
    const hint  = document.getElementById('input-hint');

    const update = () => {
      const val = input.value;
      if (val.length === 0) {
        input.classList.remove('valid', 'invalid');
        btn.classList.remove('ready');
        btn.disabled = true;
        hint.textContent = 'Min. 2 caractères — lettres, chiffres, espace, . _ -';
        hint.classList.remove('error');
        return;
      }
      if (this.validatePseudo(val)) {
        input.classList.add('valid');
        input.classList.remove('invalid');
        btn.disabled = false;
        btn.classList.add('ready');
        hint.textContent = `✅ Bienvenue, ${val.trim()} !`;
        hint.classList.remove('error');
      } else {
        input.classList.add('invalid');
        input.classList.remove('valid');
        btn.disabled = true;
        btn.classList.remove('ready');
        hint.textContent = '❌ Caractères non autorisés ou longueur incorrecte.';
        hint.classList.add('error');
      }
    };

    input.addEventListener('input', update);

    btn.addEventListener('click', () => {
      const val = input.value.trim();
      if (this.validatePseudo(val)) {
        this.app.setPlayerName(val);
        this.app.showQuiz();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btn.click();
    });

    input.focus();
  }

  // ── Classement ───────────────────────────────────────────────────────────────

  async _loadLeaderboardPreview() {
    const el = document.getElementById('lb-preview-content');
    if (!el) return;

    if (!this.app.leaderboard.isAvailable) {
      el.innerHTML = `<p class="lb-placeholder">🔒 Firebase non configuré — classement indisponible.</p>`;
      return;
    }

    try {
      const scores = await this.app.leaderboard.getTopScores(3);
      if (scores.length === 0) {
        el.innerHTML = `<p class="lb-placeholder">Aucun score enregistré. Soyez le premier !</p>`;
        return;
      }
      el.innerHTML = scores.map((s, i) => this._renderLbRow(s, i + 1)).join('');
    } catch {
      el.innerHTML = `<p class="lb-placeholder">Impossible de charger le classement.</p>`;
    }
  }

  /**
   * @param {{pseudo:string, score:number, total:number}} s
   * @param {number} rank
   * @returns {string}
   */
  _renderLbRow(s, rank) {
    const medals = ['🥇', '🥈', '🥉'];
    const medal  = medals[rank - 1] ?? `#${rank}`;
    return `
      <div class="lb-row">
        <span class="lb-rank">${medal}</span>
        <span class="lb-name">${this._esc(s.pseudo)}</span>
        <span class="lb-score">${s.score}<small>/${s.total}</small></span>
      </div>
    `;
  }

  _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
