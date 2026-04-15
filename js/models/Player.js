/**
 * @class Player
 * Modèle représentant un joueur avec son pseudo et son UID Firebase anonyme.
 */
export class Player {
  /**
   * @param {string}      pseudo - Nom du joueur
   * @param {string|null} uid    - UID Firebase (null si non connecté)
   */
  constructor(pseudo, uid = null) {
    this.pseudo = pseudo;
    this.uid    = uid;
  }

  /** @returns {string} Représentation lisible */
  toString() {
    return this.pseudo;
  }
}
