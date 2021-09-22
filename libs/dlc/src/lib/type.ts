import { ComponentFactory, InjectionToken, Type } from '@angular/core';

export type Outputs = Record<string, (event: unknown) => void>;
export type Inputs = Record<string, unknown>;
export type ComponentInputs = ComponentFactory<never>['inputs'];
export type ComponentOutputs = ComponentFactory<never>['outputs'];
export const DLC_HOST_COMPONENT = new InjectionToken('DLC_HOST_COMPONENT');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setDlcHostComponentProvider(hostComponent: Type<any>) {
  return {
    provide: DLC_HOST_COMPONENT,
    useExisting: hostComponent,
  };
}
