export function isEmpty(arg: unknown): arg is string {
  return typeof arg === 'string' && arg.length === 0;
}
