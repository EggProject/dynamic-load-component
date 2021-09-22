// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types
export function isObject(item: any): item is object {
  return item && !Array.isArray(item) && typeof item === 'object';
}
