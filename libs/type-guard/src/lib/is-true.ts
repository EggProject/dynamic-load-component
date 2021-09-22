import { isBoolean } from './is-boolean';
import { isNil } from './is-nil';

export function isTrue(obj: unknown): boolean {
  if (isBoolean(obj)) {
    if ((obj as unknown as string) === 'true' || obj === true) {
      return true;
    }
  } else if (!isNil(obj)) {
    throw new Error('Object is not boolean');
  }
  return false;
}
