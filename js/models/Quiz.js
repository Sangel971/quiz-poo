import { Question } from './Question.js';

/** Données brutes des 20 questions */
const QUESTIONS_DATA = [
  {
    text: `1 – Une saisie conservatoire peut être pratiquée sans titre exécutoire ni autorisation du JEX ?`,
    correctAnswer: true,
    explanation: `Art. L511-2 CPCE : « Une autorisation préalable du juge n'est pas nécessaire lorsque le créancier se prévaut d'un titre exécutoire ou d'une décision de justice qui n'a pas encore force exécutoire. <strong>Il en est de même en cas</strong> de défaut de paiement d'une lettre de change acceptée, d'un billet à ordre, d'un chèque ou <strong>d'un loyer resté impayé dès lors qu'il résulte d'un contrat écrit de louage d'immeubles</strong>. »`,
  },
  {
    text: `2 – Les baux commerciaux relèvent de la compétence exclusive du Tribunal de Commerce ?`,
    correctAnswer: false,
    explanation: `<strong>Compétence exclusive du Tribunal Judiciaire</strong> à l'exception des contestations relatives à la fixation du prix du bail révisé ou renouvelé, baux professionnels et conventions d'occupation précaire en matière commerciale (art. R211-3-26 11° COJ) qui relèvent de la compétence du Président du Tribunal Judiciaire (art. R213-2 COJ).`,
  },
  {
    text: `3 – Les baux d'habitation relèvent de la compétence du Président du Tribunal Judiciaire.`,
    correctAnswer: false,
    explanation: `<strong>Article L213-4-3 CPC</strong> : « Le juge des contentieux de la protection connaît des actions tendant à l'expulsion des personnes qui occupent aux fins d'habitation des immeubles bâtis sans droit ni titre. »<br><br><strong>Article L213-4-4 CPC</strong> : « Le juge des contentieux de la protection connaît des actions dont un contrat de louage d'immeubles à usage d'habitation ou un contrat portant sur l'occupation d'un logement est l'objet, la cause ou l'occasion… ».`,
  },
  {
    text: `4 – La trêve hivernale s'applique en cas d'expulsion de personnes entrées par voie de fait dans le domicile d'autrui ?`,
    correctAnswer: false,
    explanation: `Exception prévue par l'art. L412-6 CPCE.<br><br><strong>Article L412-6 CPCE</strong> : « Nonobstant toute décision d'expulsion passée en force de chose jugée […] il est sursis à toute mesure d'expulsion non exécutée à la date du 1er novembre de chaque année jusqu'au 31 mars de l'année suivante […].<br><br><strong>Par dérogation, ce sursis ne s'applique pas lorsque la mesure d'expulsion a été prononcée en raison d'une introduction sans droit ni titre dans le domicile d'autrui par voies de fait.</strong> »<br><br><strong>NB :</strong> la « voie de fait » porte gravement atteinte à une liberté fondamentale ou à un droit de propriété.`,
  },
  {
    text: `5 – Le silence de la Préfecture 2 mois après la réquisition de force publique vaut refus implicite d'accorder le concours de la force publique.`,
    correctAnswer: true,
    explanation: `(Art. R 153-1 CPCE)`,
  },
  {
    text: `6 – La réinstallation sans titre dans les mêmes locaux de la personne expulsée entraîne la délivrance d'un nouveau commandement de quitter les lieux.`,
    correctAnswer: false,
    explanation: `Art. R441-1 CPCE : « La réinstallation sans titre de la personne expulsée dans les mêmes locaux est constitutive d'une voie de fait. Le <strong>commandement d'avoir à libérer les locaux signifié auparavant continue de produire ses effets</strong> (…) »`,
  },
  {
    text: `7 – Le point de départ de la responsabilité de l'État dans le cadre d'un recours gracieux sera toujours le lendemain de l'expiration du délai de deux mois courant à compter de la réquisition de la force publique.`,
    correctAnswer: false,
    explanation: `Pour le premier recours, le point de départ de la responsabilité de l'État qui tomberait pendant la trêve hivernale sera repoussé au 1er avril.`,
  },
  {
    text: `8 – Depuis le 1er janvier 2020 il n'est plus nécessaire d'obtenir l'autorisation préalable du JEX pour procéder à la vente des meubles se trouvant dans les lieux objet de l'expulsion.`,
    correctAnswer: true,
    explanation: `« À l'expiration du délai imparti, il est procédé à la mise en vente aux enchères publiques des biens susceptibles d'être vendus. Les biens qui ne sont pas susceptibles d'être vendus sont réputés abandonnés. » (art. L433-2 al.1 CPCE)<br><br>« Les biens n'ayant aucune valeur marchande sont réputés abandonnés, à l'exception des papiers et documents de nature personnelle qui sont placés sous enveloppe scellée et conservés pendant deux ans par le Commissaire de justice. » (art. R433-6 al.1 CPCE)`,
  },
  {
    text: `9 – Dans les matières relevant de la compétence exclusive du Tribunal Judiciaire, le ministère d'Avocat est obligatoire uniquement pour les demandes supérieures à 10 000 € ?`,
    correctAnswer: false,
    explanation: `Art. 961 CPC : « Les parties sont dispensées de constituer avocat dans les cas prévus par la loi ou le règlement et dans les cas suivants :<br>(…)<br>3° <strong>À l'exclusion des matières relevant de la compétence exclusive du Tribunal Judiciaire</strong>, lorsque la demande porte sur un montant inférieur ou égal à 10 000 euros ou a pour objet une demande indéterminée ayant pour origine l'exécution d'une obligation dont le montant n'excède pas 10 000 euros. »`,
  },
  {
    text: `10 – Le dépôt de garantie non restitué dans les délais porte intérêts au profit du locataire.`,
    correctAnswer: false,
    explanation: `C'est une <strong>majoration de 10 %</strong> (et non des intérêts).<br><br>Article 22 LOI 06/07/1989 : « <strong>Le montant de ce dépôt de garantie ne porte pas intérêt au bénéfice du locataire.</strong> (…) À défaut de restitution dans les délais prévus, le dépôt de garantie restant dû au locataire est majoré d'une somme égale à <strong>10 % du loyer mensuel en principal</strong>, pour chaque période mensuelle commencée en retard. »`,
  },
  {
    text: `11 – Le débiteur ne peut plus faire opposition à l'ordonnance d'injonction de payer revêtue de la formule exécutoire.`,
    correctAnswer: false,
    explanation: `Article 1416 CPC : « L'opposition est formée dans le mois qui suit la signification de l'ordonnance.<br>Toutefois, si la signification n'a pas été faite à personne, l'opposition est recevable jusqu'à l'expiration du délai d'un mois suivant le premier acte signifié à personne ou, à défaut, suivant la première mesure d'exécution ayant pour effet de rendre indisponibles en tout ou partie les biens du débiteur. »`,
  },
  {
    text: `12 – Les prestations familiales peuvent être l'objet de voies d'exécution.`,
    correctAnswer: false,
    explanation: `<strong>Article L553-4 c. sécu. soc.</strong> : « <strong>Les prestations familiales sont incessibles et insaisissables</strong> sauf pour le recouvrement des prestations indûment versées à la suite d'une manœuvre frauduleuse ou d'une fausse déclaration de l'allocataire.<br><br>Toutefois, peuvent être saisis dans la limite d'un montant mensuel déterminé :<br>1°) pour le paiement des dettes alimentaires : l'allocation de base, les allocations familiales, le complément familial, l'ARS, l'ASF…<br>2°) pour le paiement des frais d'éducation spéciale ou de formation : l'AEEH. »`,
  },
  {
    text: `13 – La procédure de reprise des locaux abandonnés est initiée par une lettre de mise en demeure d'avoir à justifier de l'occupation des lieux envoyée par courrier recommandé avec accusé de réception.`,
    correctAnswer: false,
    explanation: `<strong>Article 14-1 loi 6 juillet 1989</strong> : « Lorsque des éléments laissent supposer que le logement est abandonné par ses occupants, le bailleur peut mettre en demeure le locataire de justifier qu'il occupe le logement.<br><br><strong>Cette mise en demeure, faite par acte de Commissaire de Justice</strong>, peut être contenue dans un des commandements visés aux articles 7 et 24. S'il n'a pas été déféré à cette mise en demeure un mois après signification, le Commissaire de justice peut procéder à la constatation de l'état d'abandon du logement. »`,
  },
  {
    text: `14 – Le ministère d'Avocat est toujours obligatoire devant le JEX.`,
    correctAnswer: false,
    explanation: `Si le ministère d'avocat est par principe obligatoire, ce principe subit des <strong>EXCEPTIONS</strong> :<br><br>Art. L121-1 CPCE : « Les parties ont la faculté de se faire assister ou représenter selon les règles applicables devant le Tribunal Judiciaire dans les matières où le ministère d'avocat n'est pas obligatoire :<br>1° Lorsque la demande est relative à l'<strong>expulsion</strong> ;<br>2° Lorsque la créance est <strong>inférieure à 10 000 €</strong> (art. R121-6 CPCE) ;<br>En matière de <strong>saisie des rémunérations</strong> (art. L3252-11 c. trav.) »`,
  },
  {
    text: `15 – Le Juge des Contentieux de la Protection statue à charge d'appel en matière d'expulsion.`,
    correctAnswer: true,
    explanation: `Art. R213-9-3 COJ`,
  },
  {
    text: `16 – L'ordonnance d'IP immédiatement exécutoire est signifiée avec commandement de payer dans le même acte de Commissaire de Justice.`,
    correctAnswer: false,
    explanation: `Le nouvel Art. 1422 CPC modifié par le décret n°2021-1322 du 11/10/2021 prévoit que :<br>« <strong>Quelles que soient les modalités de la signification, le délai d'opposition</strong> prévu au premier alinéa de l'article 1416 <strong>est suspensif d'exécution. L'opposition formée dans ce délai est également suspensive.</strong> »<br><br>Ainsi, l'ordonnance rendue, bien qu'elle soit revêtue de la formule exécutoire, <strong>n'est pas exécutoire de plein droit mais seulement à l'expiration des délais d'opposition.</strong>`,
  },
  {
    text: `17 – Les requêtes en injonction de payer portant sur un montant supérieur à 10 000 € ou relevant d'une matière de la compétence exclusive du Tribunal Judiciaire doivent être déposées par un Avocat exclusivement.`,
    correctAnswer: false,
    explanation: `L'article 1407 CPC prévoit que la requête en injonction de payer peut être présentée « <strong>par tout mandataire</strong> » et ce, quelle que soit la matière ou le montant de la demande.<br><br><strong>La question de la représentation obligatoire ne se pose donc qu'au stade de l'opposition.</strong> [Direction des affaires civiles et du Sceau – février 2020]`,
  },
  {
    text: `18 – La représentation par Avocat devant le Tribunal Judiciaire est obligatoire dans le cadre d'une procédure accélérée au fond.`,
    correctAnswer: false,
    explanation: `La règle applicable au mode de représentation dans la procédure accélérée au fond est celle qui serait applicable si la demande était présentée au fond : elle est donc déterminée selon la <strong>matière et/ou le montant du litige</strong> (art. 760 et 761 CPC pour le TJ et 874 CPC pour le TC).<br><br>Ainsi, lorsque la représentation obligatoire s'applique à raison de la matière ou du montant, elle s'applique également en procédure accélérée au fond.`,
  },
  {
    text: `19 – La solidarité du locataire victime de violences et celle de sa caution prend fin un mois après la LRAR envoyée au bailleur.`,
    correctAnswer: false,
    explanation: `Art. 8-2 loi 06/07/1989 : la désolidarisation prend effet <strong>le lendemain du jour de la première présentation de la LRAR adressée au bailleur</strong> avec copie de l'ordonnance de protection délivrée par le JAF (préalablement notifiée) ou d'une condamnation pénale rendue depuis moins de six mois.<br><br><strong>NB</strong> : la désolidarisation ne vaut que pour les dettes postérieures.`,
  },
  {
    text: `20 – Par principe, la GLI peut être cumulée avec une caution.`,
    correctAnswer: false,
    explanation: `<strong>Article 22 de la loi du 6 juillet 1989</strong> :<br>« <strong>Le cautionnement ne peut pas être demandé, à peine de nullité, par un bailleur qui a souscrit une assurance, ou toute autre forme de garantie</strong>, garantissant les obligations locatives du locataire, <strong>sauf en cas de logement loué à un étudiant ou un apprenti.</strong> »<br><br>La GLI étant une assurance souscrite par le bailleur, elle peut en principe être cumulée avec une caution uniquement pour les étudiants et apprentis.`,
  },
];

/**
 * @typedef  {Object} AnswerRecord
 * @property {boolean} userAnswer - Réponse choisie (true=VRAI, false=FAUX)
 * @property {boolean} isCorrect  - Vrai si la réponse était correcte
 */

/**
 * @class Quiz
 * Gère l'état global du quiz : questions, progression, score et historique des réponses.
 */
export class Quiz {
  constructor() {
    /** @type {Question[]} */
    this.questions = QUESTIONS_DATA.map(
      (d) => new Question(d.text, d.correctAnswer, d.explanation)
    );

    /** Index de la prochaine question à répondre (avance seulement vers l'avant) */
    this.currentIndex = 0;

    /** Score courant (incrémenté une seule fois par bonne réponse) */
    this.score = 0;

    /**
     * Historique des réponses.
     * answers[i] = null si jamais répondu, sinon { userAnswer, isCorrect }
     * @type {Array<AnswerRecord|null>}
     */
    this.answers = new Array(this.questions.length).fill(null);

    /** Index de la question actuellement affichée (navigation lecture seule) */
    this._viewIndex = 0;
  }

  // ── Accesseurs ──────────────────────────────────────────────────────────────

  /** @returns {Question} La question actuellement affichée */
  get currentQuestion() {
    return this.questions[this._viewIndex];
  }

  /** @returns {number} Index de la question affichée */
  get viewIndex() {
    return this._viewIndex;
  }

  /** @returns {number} Nombre total de questions */
  get total() {
    return this.questions.length;
  }

  /** @returns {number} Pourcentage de réussite (0–100) */
  get percentage() {
    return Math.round((this.score / this.total) * 100);
  }

  // ── Navigation ───────────────────────────────────────────────────────────────

  /**
   * Déplace la vue vers un index donné (navigation lecture seule).
   * Interdit d'aller au-delà de currentIndex.
   * @param {number} idx
   */
  setViewIndex(idx) {
    if (idx >= 0 && idx <= this.currentIndex) {
      this._viewIndex = idx;
    }
  }

  // ── Réponses ─────────────────────────────────────────────────────────────────

  /**
   * Enregistre la réponse de l'utilisateur pour la question courante (currentIndex).
   * Incrémente le score si correct. Appelé une seule fois par question.
   * @param {boolean} userAnswer - true=VRAI, false=FAUX
   * @returns {boolean} isCorrect
   */
  recordAnswer(userAnswer) {
    const q         = this.questions[this.currentIndex];
    const isCorrect = q.validate(userAnswer);
    if (isCorrect) this.score++;
    this.answers[this.currentIndex] = { userAnswer, isCorrect };
    return isCorrect;
  }

  /**
   * Vérifie si une question a déjà été répondue.
   * @param {number} idx
   * @returns {boolean}
   */
  isAnswered(idx) {
    return this.answers[idx] !== null;
  }

  // ── Progression ──────────────────────────────────────────────────────────────

  /**
   * Avance vers la question suivante (currentIndex++ ET viewIndex++).
   * À appeler seulement après recordAnswer().
   */
  nextQuestion() {
    this.currentIndex++;
    this._viewIndex = this.currentIndex;
  }

  /** @returns {boolean} Vrai si toutes les questions ont été répondues */
  isFinished() {
    return this.currentIndex >= this.questions.length;
  }

  /** Réinitialise complètement le quiz */
  reset() {
    this.currentIndex = 0;
    this._viewIndex   = 0;
    this.score        = 0;
    this.answers      = new Array(this.questions.length).fill(null);
  }
}
