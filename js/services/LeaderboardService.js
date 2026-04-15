import { db, IS_CONFIGURED } from '../config/firebase.js';
import {
  ref,
  push,
  get,
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';

/**
 * @class LeaderboardService
 * Gère les scores dans Firebase Realtime Database.
 * Structure : /scores/{pushId} → { pseudo, score, total, percentage, userId, timestamp }
 */
export class LeaderboardService {
  get isAvailable() {
    return IS_CONFIGURED && db !== null;
  }

  /**
   * Sauvegarde un score.
   * @param {string}      pseudo
   * @param {number}      score
   * @param {number}      total
   * @param {string|null} userId
   * @returns {Promise<string|null>} Clé du nœud créé, ou null
   */
  async saveScore(pseudo, score, total, userId) {
    if (!this.isAvailable) return null;
    try {
      const newRef = await push(ref(db, 'scores'), {
        pseudo,
        score,
        total,
        percentage: Math.round((score / total) * 100),
        userId:    userId ?? 'anonymous',
        timestamp: Date.now(),
      });
      return newRef.key;
    } catch (e) {
      console.warn('[Leaderboard] saveScore échoué :', e.message);
      return null;
    }
  }

  /**
   * Récupère les N meilleurs scores (triés par score décroissant).
   * @param {number} [n=10]
   * @returns {Promise<Array>}
   */
  async getTopScores(n = 10) {
    if (!this.isAvailable) return [];
    try {
      const snapshot = await get(ref(db, 'scores'));
      if (!snapshot.exists()) return [];

      const scores = [];
      snapshot.forEach((child) => {
        scores.push({ id: child.key, ...child.val() });
      });

      // Tri côté client : score décroissant, puis timestamp croissant en cas d'égalité
      return scores
        .sort((a, b) => b.score - a.score || a.timestamp - b.timestamp)
        .slice(0, n);
    } catch (e) {
      console.warn('[Leaderboard] getTopScores échoué :', e.message);
      return [];
    }
  }

  /**
   * Récupère les scores d'un joueur (non supporté simplement en RTDB — retourne []).
   * @returns {Promise<Array>}
   */
  async getPlayerScores() {
    return [];
  }
}
