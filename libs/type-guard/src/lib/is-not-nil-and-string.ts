import { isNil } from './is-nil';

export function isNotNilAndString(arg: unknown): arg is string {
  return !isNil(arg) && typeof arg === 'string';
}
