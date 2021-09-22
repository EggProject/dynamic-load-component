import { isBoolean } from './is-boolean';
import { isNil } from './is-nil';

export function isFalse(obj: unknown): boolean {
  if (isBoolean(obj)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((obj as any) === 'false' || obj === false) {
      return true;
    }
  } else if (!isNil(obj)) {
    throw new Error('Object is not boolean');
  }
  return false;
}
