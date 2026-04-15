import { View } from './View.js';

/**
 * @class ReviewView
 * Grille récapitulative 4×5 des 20 questions.
 * Chaque mini-carte est cliquable pour afficher le détail.
 */
export class ReviewView extends View {
  constructor(app) {
    super(app);
    /** @type {number|null} Index de la carte actuellement ouverte */
    this._openIdx = null;
  }

  render() {
    const { quiz, playerName } = this.app;
    const correct = quiz.answers.filter((a) => a?.isCorrect).length;
    const wrong   = quiz.answers.filter((a) => a && !a.isCorrect).length;

    return `
      <div class="review-view anim-fadeInUp">

        <!-- En-tête -->
        <div class="review-header text-center">
          <h2 class="review-title">📋 Récapitulatif</h2>
          <p class="review-player">${this._esc(playerName)}</p>
          <div class="review-summary">
            <span class="review-stat correct">✅ ${correct} correctes</span>
            <span class="review-stat wrong">❌ ${wrong} erreurs</span>
            <span class="review-stat total">📊 ${quiz.score}/${quiz.total}</span>
          </div>
        </div>

        <!-- Grille 4×5 -->
        <div class="review-grid" id="review-grid">
          ${quiz.questions.map((q, i) => this._renderMiniCard(i)).join('')}
        </div>

        <!-- Détail (affiché sous la grille) -->
        <div class="review-detail-panel glass-card" id="review-detail" style="display:none;"></div>

        <!-- Retour -->
        <div class="review-footer">
          <button class="btn-back-results" id="btn-back">← Retour aux résultats</button>
        </div>

      </div>
    `;
  }

  /**
   * Rend une mini-carte de question.
   * @param {number} i
   * @returns {string}
   */
  _renderMiniCard(i) {
    const { quiz } = this.app;
    const rec = quiz.answers[i];

    let cardCls = 'review-mini-card';
    let icon    = '⬜';

    if (rec) {
      cardCls += rec.isCorrect ? ' mini-correct' : ' mini-wrong';
      icon     = rec.isCorrect ? '✓' : '✗';
    } else {
      cardCls += ' mini-unanswered';
    }

    return `
      <div class="${cardCls}" data-idx="${i}" role="button" tabindex="0"
           aria-label="Question ${i + 1}">
        <span class="mini-number">Q${i + 1}</span>
        <span class="mini-icon">${icon}</span>
      </div>
    `;
  }

  bindEvents() {
    // Clic sur une mini-carte
    document.getElementById('review-grid').addEventListener('click', (e) => {
      const card = e.target.closest('.review-mini-card[data-idx]');
      if (!card) return;
      const idx = parseInt(card.dataset.idx, 10);
      this._toggleDetail(idx);
    });

    // Accessibilité clavier
    document.getElementById('review-grid').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.review-mini-card[data-idx]');
        if (card) {
          e.preventDefault();
          card.click();
        }
      }
    });

    // Bouton retour
    document.getElementById('btn-back').addEventListener('click', () => {
      this.app.showResults();
    });
  }

  /**
   * Affiche ou masque le détail d'une question.
   * @param {number} idx
   * @private
   */
  _toggleDetail(idx) {
    const panel = document.getElementById('review-detail');
    const cards = document.querySelectorAll('.review-mini-card');

    if (this._openIdx === idx) {
      // Ferme si déjà ouvert
      panel.style.display = 'none';
      panel.innerHTML = '';
      cards[idx]?.classList.remove('mini-active');
      this._openIdx = null;
      return;
    }

    // Retire l'état actif précédent
    if (this._openIdx !== null) {
      cards[this._openIdx]?.classList.remove('mini-active');
    }

    // Ouvre le nouveau
    this._openIdx = idx;
    cards[idx]?.classList.add('mini-active');

    panel.innerHTML  = this._renderDetail(idx);
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Animation
    panel.classList.remove('anim-zoomIn');
    void panel.offsetWidth; // reflow
    panel.classList.add('anim-zoomIn');
  }

  /**
   * Rend le panneau détail d'une question.
   * @param {number} idx
   * @returns {string}
   */
  _renderDetail(idx) {
    const { quiz } = this.app;
    const q   = quiz.questions[idx];
    const rec = quiz.answers[idx];

    if (!rec) {
      return `
        <div class="detail-unanswered">
          <p>⬜ Question ${idx + 1} — non répondue</p>
          <p class="detail-question">${this._esc(q.text)}</p>
        </div>
      `;
    }

    const userLabel    = rec.userAnswer    ? 'VRAI' : 'FAUX';
    const correctLabel = q.correctAnswer   ? 'VRAI' : 'FAUX';
    const resultIcon   = rec.isCorrect ? '✅' : '❌';
    const resultCls    = rec.isCorrect ? 'detail-correct' : 'detail-wrong';

    return `
      <div class="review-detail-content ${resultCls}">
        <div class="detail-top">
          <span class="detail-number">Q${idx + 1}</span>
          <span class="detail-result-icon">${resultIcon}</span>
          <button class="detail-close" id="detail-close" aria-label="Fermer">✕</button>
        </div>

        <p class="detail-question-text">${this._esc(q.text)}</p>

        <div class="detail-answers">
          <div class="detail-answer ${rec.userAnswer ? 'your-vrai' : 'your-faux'}">
            <span class="detail-label">Ta réponse :</span>
            <strong>${userLabel}</strong>
            ${rec.isCorrect ? ' ✅' : ' ❌'}
          </div>
          ${!rec.isCorrect ? `
            <div class="detail-answer correct-answer">
              <span class="detail-label">Bonne réponse :</span>
              <strong>${correctLabel}</strong> ✅
            </div>
          ` : ''}
        </div>

        <div class="detail-explanation">${q.explanation}</div>
      </div>
    `;
  }

  mount() {
    super.mount();
    // Délègue aussi la fermeture via le bouton "✕"
    this.container.addEventListener('click', (e) => {
      if (e.target.id === 'detail-close') {
        if (this._openIdx !== null) {
          document.querySelectorAll('.review-mini-card')[this._openIdx]?.classList.remove('mini-active');
          this._openIdx = null;
        }
        document.getElementById('review-detail').style.display = 'none';
      }
    });
  }

  _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
