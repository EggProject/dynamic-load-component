// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(item: any): item is object {
  return item && !Array.isArray(item) && typeof item === 'object';
}
