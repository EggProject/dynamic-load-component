import { Observable } from 'rxjs';

export function isObservable<T>(obj: unknown): obj is Observable<T> {
  return obj instanceof Observable;
}
