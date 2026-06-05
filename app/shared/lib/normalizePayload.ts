const PASSWORD_KEYS = new Set([
  'password',
  'confirm',
  'oldPassword',
  'newPassword',
  'hashedPassword',
  'hashedRefreshToken',
  'accessToken',
  'refreshToken',
]);

const MUTATING_METHODS = new Set(['post', 'put', 'patch']);

function isPasswordKey(key: string): boolean {
  return PASSWORD_KEYS.has(key) || /password/i.test(key);
}

function shouldSkipStringNormalization(key: string | undefined, value: string): boolean {
  if (key && isPasswordKey(key)) return true;
  if (key && (/sign$/i.test(key) || /url$/i.test(key))) return true;

  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^https?:\/\//i.test(trimmed)) return true;
  if (trimmed.length > 200 && /^[A-Za-z0-9+/=_-]+$/.test(trimmed)) return true;

  return false;
}

export function normalizeTextValue(value: string): string {
  return value
    .trim()
    .replace(/[<>"'`\\]/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .toLowerCase();
}

export function normalizePayload<T>(data: T, parentKey?: string): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    if (shouldSkipStringNormalization(parentKey, data)) {
      return data;
    }
    return normalizeTextValue(data) as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => normalizePayload(item, parentKey)) as T;
  }

  if (typeof data === 'object') {
    const normalized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      normalized[key] = normalizePayload(value, key);
    }
    return normalized as T;
  }

  return data;
}

export function shouldNormalizeRequest(
  method: string | undefined,
  data: unknown,
): data is Record<string, unknown> | unknown[] {
  if (!method || !MUTATING_METHODS.has(method.toLowerCase())) return false;
  if (data === null || data === undefined) return false;
  if (typeof FormData !== 'undefined' && data instanceof FormData) return false;
  if (typeof Blob !== 'undefined' && data instanceof Blob) return false;
  if (typeof File !== 'undefined' && data instanceof File) return false;
  return typeof data === 'object';
}
