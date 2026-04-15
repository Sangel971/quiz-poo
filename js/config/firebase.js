/**
 * firebase.js — Configuration Firebase (Realtime Database + Auth anonyme)
 */

import { initializeApp }        from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getDatabase }          from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

const FIREBASE_CONFIG = {
  apiKey:            'AIzaSyB-xbJt15wyl_OFREHEphGc8s-1li0z_EU',
  authDomain:        'mon-quiz-poo.firebaseapp.com',
  databaseURL:       'https://mon-quiz-poo-default-rtdb.europe-west1.firebasedatabase.app',
  projectId:         'mon-quiz-poo',
  storageBucket:     'mon-quiz-poo.firebasestorage.app',
  messagingSenderId: '502128778941',
  appId:             '1:502128778941:web:912fe51c8a69701d36e1d4',
};

export const IS_CONFIGURED = true;

let _db   = null;
let _auth = null;

try {
  const app = initializeApp(FIREBASE_CONFIG);
  _db   = getDatabase(app);
  _auth = getAuth(app);
} catch (e) {
  console.warn('[Firebase] Initialisation échouée :', e.message);
}

export const db   = _db;
export const auth = _auth;

/**
 * Connecte l'utilisateur anonymement.
 * @returns {Promise<string|null>} UID ou null
 */
export async function initAuth() {
  if (!_auth) return null;
  try {
    const result = await signInAnonymously(_auth);
    return result.user.uid;
  } catch (e) {
    console.warn('[Firebase] Auth anonyme échouée :', e.message);
    return null;
  }
}
