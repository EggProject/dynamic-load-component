// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPromise(p: any): p is Promise<unknown> {
  return p && Object.prototype.toString.call(p) === '[object Promise]';
}
