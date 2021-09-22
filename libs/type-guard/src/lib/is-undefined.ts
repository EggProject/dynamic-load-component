export function isUndefined(obj: unknown): obj is undefined {
  return typeof obj === 'undefined';
}

export function isNotUndefined(obj: unknown): obj is unknown {
  return typeof obj !== 'undefined';
}
