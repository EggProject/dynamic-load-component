export const DLC__OUTPUTS_CONFIGS = Symbol('DLC__OUTPUTS_CONFIGS');

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface DlcOutputConfig {
  cmpId?: string;
  methodName: string | symbol;
  outputName: string;
}

export function DlcOutput(outputName: string | string[], cmpId?: string) {
  if (outputName.length === 0) {
    throw new Error('OutputName cannot be empty');
  }
  return (target: any, propertyKey: string | symbol, descriptor?: PropertyDescriptor): PropertyDescriptor | void => {
    // store meta datas
    const configs: DlcOutputConfig[] = Reflect.get(target, DLC__OUTPUTS_CONFIGS) || [];

    configs.push(
      ...(Array.isArray(outputName) ? outputName : [outputName]).map((outputName) => ({
        methodName: propertyKey,
        outputName,
        cmpId,
      }))
    );
    Reflect.set(target, DLC__OUTPUTS_CONFIGS, configs);

    return descriptor;
  };
}
