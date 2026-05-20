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
  'Watercolour',
] as const;

export const FALLBACK_TATTOO_TYPES = ['one_layer', 'cover_up', 'retouch'] as const;

export const TATTOO_TYPE_LABELS: Record<string, { title: string; description: string }> = {
  one_layer: {
    title: 'Un solo strato di pigmento',
    description: 'Tatuaggio unico',
  },
  cover_up: {
    title: 'Copertura (cover-up)',
    description: 'Nuovo tatuaggio sopra il precedente',
  },
  retouch: {
    title: 'Ritocco o rinforzo',
    description: 'Due passaggi sullo stesso tatuaggio',
  },
};

export const INK_COLOR_LABELS: Record<string, string> = {
  black: 'Nero',
};

export function getTattooPhotoUrl(photoUrl: string | string[] | null | undefined): string | undefined {
  if (!photoUrl) return undefined;
  return Array.isArray(photoUrl) ? photoUrl[0] : photoUrl;
}

/** Indice 0 = prima del tatuaggio, indice 1 = dopo il tatuaggio */
export function syncTattooPhotos(photoUrl: string | string[] | null | undefined): {
  before?: string;
  after?: string;
} {
  const arr = Array.isArray(photoUrl) ? photoUrl : photoUrl ? [photoUrl] : [];
  return {
    before: arr[0],
    after: arr[1],
  };
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
