/** Fallback allineato a yore-back/src/api/tattoos/tattoo.constants.ts */
export const FALLBACK_INK_COLORS = ['black'] as const;

export const FALLBACK_TATTOO_STYLES = [
  'Anime',
  'Black and Grey',
  'Blackwork',
  'Botanical',
  'Color',
  'Concept',
  'Cyber',
  'Dotwork',
  'Fine-line',
  'Geometric',
  'Japanese',
  'Lettering',
  'Micro-realistic',
  'New traditional',
  'Ornamental',
  'Permanent Make up',
  'Realistic',
  'Traditional',
  'Watercolor',
] as const;

export const FALLBACK_TATTOO_TYPES = ['one_layer', 'cover_up', 'retouch'] as const;

export const TATTOO_TYPE_LABELS: Record<string, { title: string; description: string }> = {
  one_layer: {
    title: 'Nuovo tatuaggio',
    description: 'Su pelle non tatuata',
  },
  cover_up: {
    title: 'Cover-up',
    description: 'Nuovo tatuaggio sopra uno esistente',
  },
  retouch: {
    title: 'Ritocco / rinforzo',
    description: 'Secondo passaggio sullo stesso tatuaggio',
  },
};

export const INK_COLOR_LABELS: Record<string, string> = {
  black: 'Nero',
};

export const SKIN_TYPE_LABELS: Record<number, string> = {
  1: 'Molto chiara',
  2: 'Chiara',
  3: 'Medio chiara',
  4: 'Medio scura',
  5: 'Scura',
  6: 'Molto scura',
};

export const TATTOO_POSITION_LABELS: Record<number, string> = {
  1: 'Testa / viso',
  2: 'Torace',
  3: 'Gambe superiori',
  4: 'Gambe inferiori e avambracci',
  5: 'Piedi e mani',
};

export function formatDisplayDate(value?: string | null): string {
  if (!value) return '—';
  return String(value).split('T')[0];
}

export function skinTypeLabel(id?: number | null): string {
  if (id == null || id <= 0) return '—';
  return SKIN_TYPE_LABELS[id] ?? String(id);
}

export function positionLabel(id?: number | null): string {
  if (id == null || id <= 0) return '—';
  return TATTOO_POSITION_LABELS[id] ?? String(id);
}

/** Normalizza photoUrl da API (array, stringa singola o JSON serializzato). */
export function normalizePhotoUrlArray(
  photoUrl: string | string[] | null | undefined,
): string[] {
  if (!photoUrl) return [];
  if (Array.isArray(photoUrl)) {
    return photoUrl.map((u) => (typeof u === 'string' ? u.trim() : '')).filter(Boolean);
  }
  if (typeof photoUrl === 'string') {
    const trimmed = photoUrl.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .map((u) => (typeof u === 'string' ? u.trim() : ''))
            .filter(Boolean);
        }
      } catch {
        // singola URL
      }
    }
    return [trimmed];
  }
  return [];
}

/**
 * Costruisce photoUrl con indici fissi: [0] = prima, [1] = dopo.
 * Non usare filter che compatta gli indici.
 */
export function buildPhotoUrlArray(before?: string, after?: string): string[] {
  const result: string[] = [];
  const b = before?.trim();
  const a = after?.trim();
  if (b) result[0] = b;
  if (a) result[1] = a;
  return result;
}

/** Indice 0 = prima del tatuaggio, indice 1 = dopo il tatuaggio */
export function syncTattooPhotos(photoUrl: string | string[] | null | undefined): {
  before?: string;
  after?: string;
} {
  const arr = normalizePhotoUrlArray(photoUrl);
  if (!arr.length) return {};

  const before = arr[0];
  let after = arr.length > 1 ? arr[1] : undefined;

  // Dati legacy: più URL in coda (append senza indici) → prima = [0], dopo = ultimo diverso
  if (arr.length > 2) {
    const last = arr[arr.length - 1];
    if (last && last !== before) {
      after = last;
    }
  }

  if (after && after === before) {
    after = arr.slice(1).find((url) => url !== before);
  }

  return { before, after };
}

export function getTattooPhotoUrl(photoUrl: string | string[] | null | undefined): string | undefined {
  const { after, before } = syncTattooPhotos(photoUrl);
  return after ?? before;
}

export function hasKirbyDesayData(tattoo: {
  skinType?: number | null;
  position?: number | null;
  color?: string | null;
  tattooStyle?: string | null;
  tattooType?: string | null;
}): boolean {
  return (
    (tattoo.skinType != null && tattoo.skinType > 0) ||
    (tattoo.position != null && tattoo.position > 0) ||
    !!tattoo.color ||
    !!tattoo.tattooStyle ||
    !!tattoo.tattooType
  );
}
