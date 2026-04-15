import { Quiz }               from './models/Quiz.js';
import { LeaderboardService }  from './services/LeaderboardService.js';
import { initAuth }            from './config/firebase.js';
import { WelcomeView }         from './views/WelcomeView.js';
import { QuizView }            from './views/QuizView.js';
import { ResultView }          from './views/ResultView.js';
import { ReviewView }          from './views/ReviewView.js';

/** Couleurs des confettis */
const CONFETTI_COLORS = [
  '#FFD700', '#FF6B35', '#4ECDC4', '#9B59B6',
  '#00FF88', '#FF4757', '#ffffff', '#45B7D1',
];

/**
 * @class QuizApp
 * Contrôleur principal — coordonne vues, modèle et services.
 */
export class QuizApp {
  constructor() {
    /** @type {Quiz} */
    this.quiz = new Quiz();

    /** @type {string} Pseudo du joueur en cours */
    this.playerName = '';

    /** @type {string|null} UID Firebase anonyme */
    this.userId = null;

    /** @type {LeaderboardService} */
    this.leaderboard = new LeaderboardService();

    /** @type {import('./views/View.js').View|null} */
    this._currentView = null;
  }

  // ── Démarrage ────────────────────────────────────────────────────────────────

  /**
   * Démarre l'application.
   * L'auth Firebase se fait en arrière-plan sans bloquer l'UI.
   */
  start() {
    initAuth().then((uid) => { this.userId = uid; });
    this.showWelcome();
  }

  // ── Routing ──────────────────────────────────────────────────────────────────

  /**
   * Affiche une vue : démonte l'ancienne, monte la nouvelle.
   * @param {import('./views/View.js').View} view
   */
  showView(view) {
    if (this._currentView) this._currentView.unmount();
    this._currentView = view;
    view.mount();
  }

  /** Affiche la vue d'accueil (reset quiz). */
  showWelcome() {
    this.quiz.reset();
    this.showView(new WelcomeView(this));
  }

  /** Démarre le quiz (appelé depuis WelcomeView). */
  showQuiz() {
    this.quiz.reset();
    this.showView(new QuizView(this));
  }

  /** Affiche les résultats. */
  showResults() {
    this.showView(new ResultView(this));
  }

  /** Affiche la vue récapitulative des réponses. */
  showReview() {
    this.showView(new ReviewView(this));
  }

  // ── Données joueur ───────────────────────────────────────────────────────────

  /**
   * Enregistre le pseudo du joueur.
   * @param {string} name
   */
  setPlayerName(name) {
    this.playerName = name;
  }

  // ── Confettis ─────────────────────────────────────────────────────────────────

  /**
   * Lance une pluie de confettis.
   * @param {number} [count=40]
   */
  launchConfetti(count = 40) {
    let container = document.getElementById('confetti-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'confetti-container';
      container.className = 'confetti-container';
      document.body.appendChild(container);
    }

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';

      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const size  = 6 + Math.floor(Math.random() * 8);

      Object.assign(piece.style, {
        left:             `${Math.random() * 100}%`,
        backgroundColor:  color,
        width:            `${size}px`,
        height:           `${size}px`,
        borderRadius:     Math.random() > 0.5 ? '50%' : '2px',
        animationDuration:`${1.5 + Math.random() * 1.5}s`,
        animationDelay:   `${Math.random() * 0.8}s`,
      });

      container.appendChild(piece);
      piece.addEventListener('animationend', () => piece.remove());
    }

    setTimeout(() => {
      if (container && container.children.length === 0) container.remove();
    }, 4000);
  }
}

/* ── Point d'entrée ── */
document.addEventListener('DOMContentLoaded', () => {
  new QuizApp().start();
});
