/**
 * @class Question
 * Représente une question du quiz avec sa réponse et son explication.
 */
export class Question {
  /**
   * @param {string}  text          - Texte de la question
   * @param {boolean} correctAnswer - true = VRAI, false = FAUX
   * @param {string}  explanation   - Explication HTML (affiché après réponse)
   */
  constructor(text, correctAnswer, explanation) {
    this.text = text;
    this.correctAnswer = correctAnswer; // true = VRAI, false = FAUX
    this.explanation = explanation;
  }

  /**
   * Valide la réponse de l'utilisateur.
   * @param {boolean} userAnswer - true = VRAI, false = FAUX
   * @returns {boolean}
   */
  validate(userAnswer) {
    return userAnswer === this.correctAnswer;
  }

  /**
   * Retourne le libellé de la bonne réponse.
   * @returns {string}
   */
  get correctLabel() {
    return this.correctAnswer ? 'VRAI' : 'FAUX';
  }
}
