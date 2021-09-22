// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNumeric(obj: any): obj is number {
  return !Array.isArray(obj) && obj - parseFloat(obj) + 1 >= 0;
}
