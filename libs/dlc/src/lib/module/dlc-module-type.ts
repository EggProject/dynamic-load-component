import { isNil } from '@dynamic-load-component/type-guard';
import { DLC__BOOTSTRAP_COMPONENT } from '../decorator/dlc-bootstrap-component/dlc-bootstrap-component.decorator';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * DlcModuleDef typescript type guard
 */
export function isDlcModule(module?: any): boolean {
  return !isNil(module) && !isNil(Reflect.get(module, DLC__BOOTSTRAP_COMPONENT));
}
