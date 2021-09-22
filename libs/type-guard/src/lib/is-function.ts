// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(obj: unknown): obj is Function {
  return typeof obj === 'function';
}
