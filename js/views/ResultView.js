import { View } from './View.js';

/**
 * @class ResultView
 * Vue des résultats finaux.
 * - Sauvegarde le score dans Firebase au montage
 * - Affiche le TOP 10 du classement avec le joueur mis en surbrillance
 * - 3 boutons : Voir mes réponses / Rejouer / Classement (ancre)
 */
export class ResultView extends View {
  constructor(app) {
    super(app);
    this._savedDocId = null;
  }

  /** @returns {{ trophy, message, cls, emoji }} */
  _getLevel(pct) {
    if (pct >= 90) return { trophy: '🏆', message: 'Exceptionnel ! Maîtrise parfaite.', cls: 'score-excellent', emoji: '🎉🌟🥇' };
    if (pct >= 70) return { trophy: '⭐', message: 'Très bien ! Continue comme ça.',     cls: 'score-good',      emoji: '👍🎯' };
    if (pct >= 50) return { trophy: '📚', message: 'Bien joué ! Encore quelques révisions.', cls: 'score-average', emoji: '😊💪' };
    return          { trophy: '💪', message: 'À retravailler — les fiches sont tes amies !', cls: 'score-low', emoji: '🎯📖' };
  }

  render() {
    const { quiz, playerName } = this.app;
    const pct   = quiz.percentage;
    const level = this._getLevel(pct);
    const barGradient =
      pct >= 90 ? 'linear-gradient(90deg,#00FF88,#00c96a)' :
      pct >= 70 ? 'linear-gradient(90deg,#FFD700,#e5a800)' :
      pct >= 50 ? 'linear-gradient(90deg,#4ECDC4,#3ab5ad)' :
                  'linear-gradient(90deg,#FF6B35,#e55a2b)';

    return `
      <div class="result-view">

        <!-- ── Titre ── -->
        <div class="text-center">
          <div class="result-trophy">${level.trophy}</div>
          <h1 class="result-title">Quiz terminé !</h1>
          <p class="result-player">Bravo, <span>${this._esc(playerName)}</span> !</p>
        </div>

        <!-- ── Score ── -->
        <div class="glass-card result-card">
          <div class="score-display text-center">
            <div>
              <span class="score-number ${level.cls}" id="score-num">0</span>
              <span class="score-divider"> / </span>
              <span class="score-total">${quiz.total}</span>
            </div>
            <p class="score-label">Score final</p>
          </div>
          <div class="result-progress">
            <div class="result-progress-fill" id="result-bar"
              style="width:0%;background:${barGradient}"></div>
          </div>
          <div class="text-center mt-2">
            <p class="result-message">${level.message}</p>
            <p class="result-emoji mt-1">${level.emoji}</p>
          </div>
        </div>

        <!-- ── 3 Boutons d'action ── -->
        <div class="result-actions">
          <button class="btn-action btn-review" id="btn-review">
            🔍 Voir mes réponses
          </button>
          <div class="result-actions-row">
            <button class="btn-action btn-replay" id="btn-replay">
              🔄 Rejouer
            </button>
            <button class="btn-action btn-leaderboard-scroll" id="btn-lb-scroll">
              🏆 Classement
            </button>
          </div>
        </div>

        <!-- ── Classement TOP 10 ── -->
        <div class="glass-card leaderboard-section" id="leaderboard-section">
          <div class="lb-section-header">🏆 TOP 10</div>
          <div id="lb-full-content">
            <div class="lb-loading">Chargement du classement…</div>
          </div>
        </div>

      </div>
    `;
  }

  async mount() {
    super.mount();
    this._animateScore();
    if (this.app.quiz.percentage >= 50) {
      setTimeout(() => this.app.launchConfetti(60), 400);
    }
    // Sauvegarde + classement en parallèle
    this._saveAndLoadLeaderboard();
  }

  bindEvents() {
    document.getElementById('btn-review').addEventListener('click', () => {
      this.app.showReview();
    });

    document.getElementById('btn-replay').addEventListener('click', () => {
      this.app.showWelcome();
    });

    document.getElementById('btn-lb-scroll').addEventListener('click', () => {
      document.getElementById('leaderboard-section')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ── Firebase ─────────────────────────────────────────────────────────────────

  async _saveAndLoadLeaderboard() {
    const { quiz, playerName, userId, leaderboard } = this.app;

    // Sauvegarde du score
    this._savedDocId = await leaderboard.saveScore(
      playerName, quiz.score, quiz.total, userId,
    );

    // Chargement TOP 10
    const el = document.getElementById('lb-full-content');
    if (!el) return;

    if (!leaderboard.isAvailable) {
      el.innerHTML = `<p class="lb-placeholder">🔒 Firebase non configuré — classement indisponible.</p>`;
      return;
    }

    try {
      const scores = await leaderboard.getTopScores(10);
      if (scores.length === 0) {
        el.innerHTML = `<p class="lb-placeholder">Aucun score enregistré.</p>`;
        return;
      }
      el.innerHTML = scores.map((s, i) => this._renderLbRow(s, i + 1)).join('');
    } catch {
      el.innerHTML = `<p class="lb-placeholder">Impossible de charger le classement.</p>`;
    }
  }

  _renderLbRow(s, rank) {
    const { playerName } = this.app;
    const medals  = ['🥇', '🥈', '🥉'];
    const medal   = medals[rank - 1] ?? `${rank}.`;
    const isMe    = s.id === this._savedDocId
                 || s.pseudo.toLowerCase() === playerName.toLowerCase();
    const hlClass = isMe ? 'lb-row-highlight' : '';

    return `
      <div class="lb-row ${hlClass}">
        <span class="lb-rank">${medal}</span>
        <span class="lb-name">${this._esc(s.pseudo)}${isMe ? ' <em>(vous)</em>' : ''}</span>
        <span class="lb-score">${s.score}<small>/${s.total}</small></span>
        <span class="lb-pct">${s.percentage}%</span>
      </div>
    `;
  }

  // ── Animations ────────────────────────────────────────────────────────────────

  _animateScore() {
    const { score, total } = this.app.quiz;
    const el  = document.getElementById('score-num');
    const bar = document.getElementById('result-bar');
    const pct = Math.round((score / total) * 100);

    let current = 0;
    const step  = Math.max(1, Math.ceil(score / 20));
    const tick  = () => {
      if (current >= score) { el.textContent = score; bar.style.width = `${pct}%`; return; }
      current = Math.min(current + step, score);
      el.textContent = current;
      bar.style.width = `${Math.round((current / total) * 100)}%`;
      requestAnimationFrame(tick);
    };
    setTimeout(tick, 500);
  }

  _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
