export type DeclarationAnswerKey =
  | 'declPreviousPigmentation'
  | 'declPreviousBotoxFiller'
  | 'declHypertrophicScarsKeloids'
  | 'declHeartConditions'
  | 'declPacemaker'
  | 'declSkinDiseases'
  | 'declHepatitisAidsEtc'
  | 'declPsoriasisFamily'
  | 'declRadioChemoLast18Months'
  | 'declChronicMedication'
  | 'declPregnancyBreastfeeding'
  | 'declMetalAllergy'
  | 'declBloodThinners'
  | 'declConsentPhotosMarketing'
  | 'declConsentDesignStencil'
  | 'declConsentYoreInkSingleUse'
  | 'declConsentYoreInkNewSealed';

export type DeclarationDetailKey =
  | 'declSkinDiseasesDetail'
  | 'declPsoriasisFamilyDetail';

export type DeclarationOptionalNoteKey = 'declMedicalConditionsNotes';

export const DECLARATION_MEDICAL_NOTES_LABEL =
  'Indicare di seguito eventuali patologie attuali e/o pregresse, incluse condizioni mediche rilevanti ai fini del trattamento:';

export type TattooDeclarationsState = Record<DeclarationAnswerKey, boolean | null> &
  Record<DeclarationDetailKey, string> &
  Record<DeclarationOptionalNoteKey, string>;

export const DECLARATION_QUESTIONS: {
  key: DeclarationAnswerKey;
  label: string;
  detailKey?: DeclarationDetailKey;
  detailPlaceholder?: string;
}[] = [
  {
    key: 'declPreviousPigmentation',
    label:
      'di essersi già sottoposto in precedenza ad un trattamento di pigmentazione, tatuaggio e/o piercing',
  },
  {
    key: 'declPreviousBotoxFiller',
    label:
      'di essersi sottoposto in precedenza a trattamenti di Botox e/o filler o altri trattamenti similari',
  },
  {
    key: 'declHypertrophicScarsKeloids',
    label: 'di essere soggetto a cicatrizzazioni ipertrofiche e/o cheloidi',
  },
  {
    key: 'declHeartConditions',
    label:
      'di soffrire di anomalie cardiache acquisite o congenite, alterazioni valvolari e cardiopatiche',
  },
  {
    key: 'declPacemaker',
    label: 'di essere un portatore di pace-maker',
  },
  {
    key: 'declSkinDiseases',
    label: 'di essere affetto da malattie cutanee (se sì, quali)',
    detailKey: 'declSkinDiseasesDetail',
    detailPlaceholder: 'Specificare quali malattie cutanee',
  },
  {
    key: 'declHepatitisAidsEtc',
    label: 'di essere affetto da epatite virale, AIDS, emofilia, diabete, epilessia',
  },
  {
    key: 'declPsoriasisFamily',
    label:
      'di essere affetto da psoriasi o di avere casi in famiglia di psoriasi (se sì, specificare chi)',
    detailKey: 'declPsoriasisFamilyDetail',
    detailPlaceholder: 'Specificare chi in famiglia',
  },
  {
    key: 'declRadioChemoLast18Months',
    label: "di essersi sottoposto a radio/chemio terapia nell'ultimo anno e mezzo",
  },
  {
    key: 'declChronicMedication',
    label: 'di assumere in modo costante e continuativo farmaci per malattie croniche',
  },
  {
    key: 'declPregnancyBreastfeeding',
    label: 'di essere in stato di gravidanza o allattamento',
  },
  {
    key: 'declMetalAllergy',
    label:
      'di essere allergico a metalli, quali nichel, piombo… (accertato con patch test)',
  },
  {
    key: 'declBloodThinners',
    label:
      "di essere sotto l'effetto di farmaci che fluidificano il sangue (es. aspirina, coumadin…)",
  },
  {
    key: 'declConsentPhotosMarketing',
    label:
      "di acconsentire l'operatore ad utilizzare le immagini della parte trattata, prima e dopo il trattamento, per i book dimostrativi ed eventuali pubblicità e pubblicazioni",
  },
  {
    key: 'declConsentDesignStencil',
    label:
      'di aver visionato, controllato e accettato il disegno e il relativo stencil (anche in caso di piercing)',
  },
  {
    key: 'declConsentYoreInkSingleUse',
    label:
      'di acconsentire che l\'operatore utilizzi l\'inchiostro "YORE unique ink black" in formato monodose esclusivamente per la singola sessione di tatuaggio oggetto del presente consenso, con espresso divieto di riutilizzo e di conservazione per sessioni successive',
  },
  {
    key: 'declConsentYoreInkNewSealed',
    label:
      'di aver visionato e verificato che l\'inchiostro "YORE unique ink black" in formato monodose utilizzato per il trattamento sia nuovo, integro e correttamente sigillato prima dell\'apertura',
  },
];

export const DECLARATION_ANSWER_KEYS = DECLARATION_QUESTIONS.map((q) => q.key);

export function createEmptyDeclarations(): TattooDeclarationsState {
  return {
    declPreviousPigmentation: null,
    declPreviousBotoxFiller: null,
    declHypertrophicScarsKeloids: null,
    declHeartConditions: null,
    declPacemaker: null,
    declSkinDiseases: null,
    declSkinDiseasesDetail: '',
    declHepatitisAidsEtc: null,
    declPsoriasisFamily: null,
    declPsoriasisFamilyDetail: '',
    declRadioChemoLast18Months: null,
    declChronicMedication: null,
    declPregnancyBreastfeeding: null,
    declMetalAllergy: null,
    declBloodThinners: null,
    declConsentPhotosMarketing: null,
    declConsentDesignStencil: null,
    declConsentYoreInkSingleUse: null,
    declConsentYoreInkNewSealed: null,
    declMedicalConditionsNotes: '',
  };
}

export function hasDeclarationsData(tattoo: Record<string, unknown>): boolean {
  return DECLARATION_ANSWER_KEYS.some((key) => tattoo[key] !== null && tattoo[key] !== undefined);
}
