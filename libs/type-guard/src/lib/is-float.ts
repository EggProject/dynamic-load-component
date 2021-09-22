export function isFloat(n: unknown): boolean {
  return Number(n) === n && n % 1 !== 0;
}
