export function isBoolean(obj: unknown): obj is boolean {
  return typeof obj === 'boolean' || obj === 'true' || obj === 'false';
}
