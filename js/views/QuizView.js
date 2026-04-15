import { View } from './View.js';

/**
 * @class QuizView
 * Vue principale du quiz.
 *
 * Deux modes :
 *  - INTERACTIF  : quiz.viewIndex === quiz.currentIndex ET pas encore répondu
 *  - LECTURE SEULE : question déjà validée (viewIndex < currentIndex, ou currentIndex déjà répondu)
 *
 * La navigation ← → et les 20 points de progression sont toujours visibles.
 * Une fois une réponse validée, elle est figée (pointer-events: none).
 * Le score est incrémenté une seule fois via quiz.recordAnswer().
 */
export class QuizView extends View {
  constructor(app) {
    super(app);
    /**
     * Réponse sélectionnée en mode interactif (avant validation).
     * null = rien sélectionné.
     * @type {boolean|null}
     */
    this._pendingAnswer = null;
  }

  // ── Rendu principal ──────────────────────────────────────────────────────────

  render() {
    const { quiz } = this.app;
    const v        = quiz.viewIndex;
    const q        = quiz.questions[v];
    const answered = quiz.isAnswered(v);
    const isReadOnly = answered; // mode lecture seule dès que la question a une réponse

    return `
      <div class="quiz-view">

        <!-- ── Navigation principale (flèches + dots) ── -->
        <div class="quiz-nav-header anim-fadeInDown">
          <button
            class="btn-nav btn-nav-prev"
            id="btn-prev"
            ${v === 0 ? 'disabled' : ''}
            aria-label="Question précédente"
          >← Préc.</button>

          <div class="progress-dots" id="progress-dots" role="tablist">
            ${this._renderDots()}
          </div>

          <button
            class="btn-nav btn-nav-next"
            id="btn-nav-next"
            ${this._isNextEnabled() ? '' : 'disabled'}
            aria-label="Question suivante"
          >${this._nextLabel()}</button>
        </div>

        <!-- ── Badge joueur + score ── -->
        <div class="quiz-header">
          <div class="quiz-player-badge">👤 ${this._esc(this.app.playerName)}</div>
          <div class="quiz-score-badge" id="score-badge">⭐ ${quiz.score} / ${quiz.total}</div>
        </div>

        <!-- ── Carte question ── -->
        <div class="glass-card question-card ${isReadOnly ? 'frozen' : ''}" id="question-card">
          <div class="question-card-top">
            <span class="question-number">Question ${v + 1}</span>
            ${isReadOnly ? '<span class="validated-badge">✓ Validé</span>' : ''}
          </div>
          <p class="question-text">${this._esc(q.text)}</p>
        </div>

        <!-- ── Boutons VRAI / FAUX ── -->
        <div class="answers-grid ${isReadOnly ? 'answers-frozen' : ''}" id="answers-grid">
          ${this._renderAnswerButtons(v, answered, isReadOnly)}
        </div>

        <!-- ── Bouton VALIDER (interactif uniquement, avant sélection) ── -->
        <div class="btn-validate-wrapper" id="validate-wrapper" style="display:none;">
          <button class="btn-validate" id="btn-validate">VALIDER ➜</button>
        </div>

        <!-- ── Feedback (affiché si répondu) ── -->
        <div id="feedback-area">
          ${answered ? this._renderFeedback(quiz.answers[v], q) : ''}
        </div>

      </div>
    `;
  }

  // ── Événements ───────────────────────────────────────────────────────────────

  bindEvents() {
    const { quiz } = this.app;

    // Flèche PRÉCÉDENT
    document.getElementById('btn-prev').addEventListener('click', () => {
      quiz.setViewIndex(quiz.viewIndex - 1);
      this._pendingAnswer = null;
      this.mount();
    });

    // Flèche SUIVANT / avance quiz
    document.getElementById('btn-nav-next').addEventListener('click', () => {
      if (quiz.viewIndex < quiz.currentIndex) {
        // Navigation lecture seule → avance d'un cran
        quiz.setViewIndex(quiz.viewIndex + 1);
        this._pendingAnswer = null;
        this.mount();
      } else {
        // Avance réelle dans le quiz
        quiz.nextQuestion();
        if (quiz.isFinished()) {
          this.app.showResults();
        } else {
          this._pendingAnswer = null;
          this.mount();
        }
      }
    });

    // Clic sur les dots de progression
    document.getElementById('progress-dots').addEventListener('click', (e) => {
      const dot = e.target.closest('.progress-dot[data-idx]');
      if (!dot) return;
      const idx = parseInt(dot.dataset.idx, 10);
      if (idx <= quiz.currentIndex) {
        quiz.setViewIndex(idx);
        this._pendingAnswer = null;
        this.mount();
      }
    });

    // Boutons VRAI / FAUX (mode interactif seulement)
    if (!quiz.isAnswered(quiz.viewIndex)) {
      const grid = document.getElementById('answers-grid');
      grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-answer[data-answer]');
        if (!btn) return;
        const answer = btn.dataset.answer === 'true';
        this._selectAnswer(answer);
      });
    }

    // Bouton VALIDER
    const valBtn = document.getElementById('btn-validate');
    if (valBtn) {
      valBtn.addEventListener('click', () => {
        if (this._pendingAnswer === null) return;
        this._validate();
      });
    }
  }

  // ── Sélection d'une réponse (interactif) ────────────────────────────────────

  /**
   * @param {boolean} answer
   * @private
   */
  _selectAnswer(answer) {
    this._pendingAnswer = answer;

    // Mise à jour visuelle des boutons
    const btnVrai = document.getElementById('btn-vrai');
    const btnFaux = document.getElementById('btn-faux');
    btnVrai.classList.toggle('selected', answer === true);
    btnFaux.classList.toggle('selected', answer === false);

    // Effet "appuyé"
    const active = answer ? btnVrai : btnFaux;
    active.style.transform = 'scale(0.95)';
    setTimeout(() => { active.style.transform = ''; }, 120);

    // Affiche le bouton VALIDER
    document.getElementById('validate-wrapper').style.display = 'block';
  }

  // ── Validation ───────────────────────────────────────────────────────────────

  /** @private */
  _validate() {
    const { quiz }  = this.app;
    const isCorrect = quiz.recordAnswer(this._pendingAnswer);
    const q         = quiz.questions[quiz.currentIndex];

    // Fige les boutons
    this._freezeButtons(this._pendingAnswer, isCorrect);

    // Masque VALIDER
    document.getElementById('validate-wrapper').style.display = 'none';

    // Animation carte question
    const card = document.getElementById('question-card');
    card.classList.add(isCorrect ? 'anim-correct' : 'anim-shake', 'frozen');
    setTimeout(() => card.classList.remove('anim-correct', 'anim-shake'), 500);

    // Badge validé
    const top = card.querySelector('.question-card-top');
    if (!top.querySelector('.validated-badge')) {
      top.insertAdjacentHTML('beforeend', '<span class="validated-badge">✓ Validé</span>');
    }

    // Affiche le feedback
    document.getElementById('feedback-area').innerHTML = this._renderFeedback(
      { userAnswer: this._pendingAnswer, isCorrect },
      q,
    );

    // Met à jour le score badge
    document.getElementById('score-badge').textContent = `⭐ ${quiz.score} / ${quiz.total}`;

    // Met à jour le dot courant
    this._refreshDot(quiz.currentIndex, isCorrect);

    // Active le bouton SUIVANT
    const nextBtn = document.getElementById('btn-nav-next');
    nextBtn.disabled = false;
    nextBtn.textContent = this._nextLabel(true);

    // Confetti si correct
    if (isCorrect) this.app.launchConfetti();
  }

  // ── Helpers rendu ────────────────────────────────────────────────────────────

  /**
   * Rend les 20 dots de progression.
   * @returns {string}
   */
  _renderDots() {
    const { quiz } = this.app;
    return Array.from({ length: quiz.total }, (_, i) => {
      const cls = this._dotClass(i);
      const clickable = i <= quiz.currentIndex;
      return `<span
        class="progress-dot ${cls}"
        data-idx="${i}"
        role="tab"
        aria-label="Question ${i + 1}"
        style="${clickable ? 'cursor:pointer' : 'cursor:default'}"
      ></span>`;
    }).join('');
  }

  /**
   * Calcule la classe CSS d'un dot.
   * @param {number} i
   * @returns {string}
   */
  _dotClass(i) {
    const { quiz } = this.app;
    let cls = '';

    if (i > quiz.currentIndex) {
      cls = 'dot-future';
    } else if (quiz.isAnswered(i)) {
      cls = quiz.answers[i].isCorrect ? 'dot-correct' : 'dot-wrong';
    } else {
      cls = 'dot-current'; // currentIndex non encore répondu
    }

    if (i === quiz.viewIndex) cls += ' dot-viewing';
    return cls;
  }

  /**
   * Rafraîchit un dot après validation sans re-render complet.
   * @param {number} idx
   * @param {boolean} isCorrect
   * @private
   */
  _refreshDot(idx, isCorrect) {
    const dot = document.querySelector(`.progress-dot[data-idx="${idx}"]`);
    if (!dot) return;
    dot.classList.remove('dot-current', 'dot-future');
    dot.classList.add(isCorrect ? 'dot-correct' : 'dot-wrong');
  }

  /**
   * Rend les boutons VRAI / FAUX selon l'état.
   * @param {number}  v
   * @param {boolean} answered
   * @param {boolean} isReadOnly
   * @returns {string}
   */
  _renderAnswerButtons(v, answered, isReadOnly) {
    const { quiz } = this.app;
    const rec = answered ? quiz.answers[v] : null;

    const vraiClass = this._btnClass('vrai', rec, isReadOnly);
    const fauxClass = this._btnClass('faux', rec, isReadOnly);

    return `
      <button class="btn-answer btn-vrai ${vraiClass}" id="btn-vrai"
        data-answer="true" ${isReadOnly ? 'disabled' : ''}>
        ✅ VRAI
      </button>
      <button class="btn-answer btn-faux ${fauxClass}" id="btn-faux"
        data-answer="false" ${isReadOnly ? 'disabled' : ''}>
        ❌ FAUX
      </button>
    `;
  }

  /**
   * Calcule les classes CSS d'un bouton réponse selon son état.
   * @param {'vrai'|'faux'} side
   * @param {AnswerRecord|null} rec
   * @param {boolean} isReadOnly
   * @returns {string}
   */
  _btnClass(side, rec, isReadOnly) {
    if (!rec || !isReadOnly) return '';
    const isVrai = side === 'vrai';
    const chosen = rec.userAnswer === isVrai;   // l'utilisateur a choisi ce bouton
    const correct = this.app.quiz.questions[this.app.quiz.viewIndex].correctAnswer === isVrai;

    if (chosen && rec.isCorrect)  return 'btn-frozen-correct'; // bonne réponse choisie
    if (chosen && !rec.isCorrect) return 'btn-frozen-wrong';   // mauvaise réponse choisie
    if (!chosen && correct)       return 'btn-frozen-reveal';  // bonne réponse non choisie
    return 'btn-frozen-neutral';
  }

  /**
   * Fige les boutons après validation.
   * @param {boolean} userAnswer
   * @param {boolean} isCorrect
   * @private
   */
  _freezeButtons(userAnswer, isCorrect) {
    const btnVrai = document.getElementById('btn-vrai');
    const btnFaux = document.getElementById('btn-faux');

    [btnVrai, btnFaux].forEach((b) => {
      b.disabled = true;
      b.classList.remove('selected');
    });

    // Bouton choisi par l'utilisateur
    const chosen = userAnswer ? btnVrai : btnFaux;
    chosen.classList.add(isCorrect ? 'btn-frozen-correct' : 'btn-frozen-wrong');

    // Si incorrect, révèle la bonne réponse
    if (!isCorrect) {
      const correctBtn = userAnswer ? btnFaux : btnVrai;
      correctBtn.classList.add('btn-frozen-reveal');
    }
  }

  /**
   * Rend la carte de feedback.
   * @param {{userAnswer:boolean, isCorrect:boolean}} rec
   * @param {import('../models/Question.js').Question} q
   * @returns {string}
   */
  _renderFeedback(rec, q) {
    const cls  = rec.isCorrect ? 'correct' : 'incorrect';
    const icon = rec.isCorrect ? '🎉' : '💡';
    const msg  = rec.isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse…';

    return `
      <div class="feedback-card ${cls}">
        <div class="feedback-header">
          <span class="feedback-icon">${icon}</span>
          <span>${msg}</span>
        </div>
        ${!rec.isCorrect
          ? `<p class="feedback-correct-label">
               ✅ Bonne réponse : <strong>${q.correctLabel}</strong>
             </p>`
          : ''}
        <div class="feedback-explanation">${q.explanation}</div>
      </div>
    `;
  }

  /**
   * Le bouton SUIVANT est-il actif ?
   * @param {boolean} [justValidated=false]
   * @returns {boolean}
   */
  _isNextEnabled(justValidated = false) {
    const { quiz } = this.app;
    const v = quiz.viewIndex;

    if (v < quiz.currentIndex) return true;                   // navigation lecture seule
    if (quiz.isAnswered(v))     return !quiz.isFinished();     // vient d'être validé
    return justValidated;
  }

  /**
   * Libellé du bouton SUIVANT.
   * @param {boolean} [justValidated=false]
   * @returns {string}
   */
  _nextLabel(justValidated = false) {
    const { quiz } = this.app;
    const v = quiz.viewIndex;

    if (v < quiz.currentIndex) return 'Suiv. →';
    if (quiz.isAnswered(v) || justValidated) {
      if (quiz.currentIndex >= quiz.total - 1) return '🏆 Résultats';
      return 'Suiv. →';
    }
    return 'Suiv. →';
  }

  /** Échappe le HTML */
  _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
