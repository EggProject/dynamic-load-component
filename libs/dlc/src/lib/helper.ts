import { OnChanges } from '@angular/core';
import { isFunction, isNil } from '@dynamic-load-component/type-guard';

export function isImplementedNgOnChanges(cmp?: Partial<OnChanges>): cmp is OnChanges {
  return !isNil(cmp) && isFunction(cmp.ngOnChanges);
}
