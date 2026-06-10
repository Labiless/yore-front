export function getApiErrorMessage(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;

  if (Array.isArray(message)) {
    return message[0] ?? fallback;
  }

  if (typeof message === 'string' && message.length) {
    return message;
  }

  return fallback;
}

export function getLoginErrorMessage(error: unknown): string {
  const status = (error as { response?: { status?: number } })?.response?.status;

  if (status === 401) {
    return 'Credenziali errate';
  }

  return getApiErrorMessage(error, 'Errore durante il login. Riprova.');
}
