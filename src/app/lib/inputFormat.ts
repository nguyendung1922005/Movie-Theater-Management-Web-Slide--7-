/** Format digits as grouped thousands while typing (VND-style display). */
export function formatDigitsAsCurrencyTyping(raw: string, maxDigits = 14): string {
  const digits = raw.replace(/\D/g, "").slice(0, maxDigits);
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
}

export function digitsOnlyFromFormatted(s: string): string {
  return s.replace(/\D/g, "");
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** VN-style 10-digit mobile (starts with 0) */
export const PHONE_10_REGEX = /^0\d{9}$/;

export function normalizePhoneDigits(s: string): string {
  return s.replace(/\D/g, "").slice(0, 10);
}
