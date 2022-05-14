import { InjectionToken, Type } from '@angular/core';

export interface UserOutputs {
  [key: string]: (event: unknown) => void;
}
export interface UserInputs {
  [key: string]: unknown;
}
export const DLC_HOST_COMPONENT = new InjectionToken('DLC_HOST_COMPONENT');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setDlcHostComponentProvider(hostComponent: Type<any>) {
  return {
    provide: DLC_HOST_COMPONENT,
    useExisting: hostComponent,
  };
}
