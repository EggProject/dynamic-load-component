import { isUndefined } from './is-undefined';

export function isNil<T>(value: T | null | undefined): value is null | undefined {
  return value === null || isUndefined(value);
}
