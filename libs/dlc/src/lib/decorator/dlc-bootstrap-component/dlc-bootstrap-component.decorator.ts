import { Type } from '@angular/core';
import { isNil } from '@dynamic-load-component/type-guard';

export const DLC__BOOTSTRAP_COMPONENT = Symbol('DLC__BOOTSTRAP_COMPONENT');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DlcBootstrapComponent(cmpDefRef: Type<any>) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return <TFunction extends Function>(target: TFunction): TFunction | void => {
    if (isNil(Reflect.get(target, DLC__BOOTSTRAP_COMPONENT))) {
      Reflect.set(target, DLC__BOOTSTRAP_COMPONENT, cmpDefRef);
    }
  };
}
