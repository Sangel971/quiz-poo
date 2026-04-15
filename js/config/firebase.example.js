/**
 * firebase.example.js — Template de configuration Firebase
 *
 * INSTRUCTIONS :
 *  1. Copiez ce fichier → renommez-le firebase.js
 *  2. Remplacez les valeurs VOTRE_* par votre config Firebase
 *     (Console Firebase → Paramètres du projet → Vos applications)
 *  3. firebase.js est dans .gitignore — il ne sera jamais commité
 */

import { initializeApp }             from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getDatabase }               from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

const FIREBASE_CONFIG = {
  apiKey:            'VOTRE_API_KEY',
  authDomain:        'VOTRE_PROJECT.firebaseapp.com',
  databaseURL:       'https://VOTRE_PROJECT-default-rtdb.europe-west1.firebasedatabase.app',
  projectId:         'VOTRE_PROJECT_ID',
  storageBucket:     'VOTRE_PROJECT.firebasestorage.app',
  messagingSenderId: 'VOTRE_SENDER_ID',
  appId:             'VOTRE_APP_ID',
};

export const IS_CONFIGURED = FIREBASE_CONFIG.apiKey !== 'VOTRE_API_KEY';

let _db = null, _auth = null;
if (IS_CONFIGURED) {
  try {
    const app = initializeApp(FIREBASE_CONFIG);
    _db   = getDatabase(app);
    _auth = getAuth(app);
  } catch (e) { console.warn('[Firebase] Init échouée :', e.message); }
}

export const db = _db;
export const auth = _auth;

export async function initAuth() {
  if (!_auth) return null;
  try {
    return (await signInAnonymously(_auth)).user.uid;
  } catch (e) { return null; }
}
