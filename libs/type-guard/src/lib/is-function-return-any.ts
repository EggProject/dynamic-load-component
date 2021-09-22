export function isFunctionReturnAny(
  obj: unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): obj is (...args: any) => any {
  return typeof obj === 'function';
}
