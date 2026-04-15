/**
 * @class View
 * Classe de base abstraite pour toutes les vues.
 * Fournit les méthodes communes render(), mount(), unmount() et bindEvents().
 */
export class View {
  /**
   * @param {import('../app.js').QuizApp} app - Référence au contrôleur principal
   */
  constructor(app) {
    /** @type {import('../app.js').QuizApp} */
    this.app = app;
    /** @type {HTMLElement} */
    this.container = document.getElementById('app');
  }

  /**
   * Retourne le HTML de la vue.
   * @returns {string}
   */
  render() {
    return '';
  }

  /**
   * Monte la vue : injecte le HTML et attache les événements.
   */
  mount() {
    this.container.innerHTML = this.render();
    this.bindEvents();
  }

  /**
   * Attache les écouteurs d'événements (à surcharger dans les sous-classes).
   */
  bindEvents() {}

  /**
   * Démonte la vue : vide le conteneur.
   */
  unmount() {
    this.container.innerHTML = '';
  }
}
