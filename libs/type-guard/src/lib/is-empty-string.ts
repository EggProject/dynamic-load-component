export function isEmptyString(arg: unknown): boolean {
  return typeof arg === 'string' && arg.length === 0;
}
