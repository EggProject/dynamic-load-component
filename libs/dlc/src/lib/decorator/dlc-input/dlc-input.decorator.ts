export const DLC__INPUTS_CONFIGS = Symbol('DLC__INPUTS_CONFIGS');

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface DlcInputConfig<E> {
  cmpId?: string;
  propertyKey: string;
  originalPropertyKey: string;
  changeCallbacks: {
    /**
     * hogy a callback visszakeresheto legyen
     */
    id: string;
    cb: (newVal: E) => void;
  }[];
}

/**
 * Ha olyan input-t szeretnenk bind-olni a dynamic component-be, ami valtozhat
 * akkor erdemes egy osztaly valtozot megjelolni ezzel a decoratorral.
 * A decorator az osztaly valtozo nevenek ugyan azt a nevet varja el mint amivel
 * a dynamic component-ben az input meg van adva. Ha az input decorator-ban
 * felul van irva a nev akkor arra kell hivatkozni:
 * `@Input('override') valami:string`
 * tehat ebben az esetben override neven kell letrehozni a valtozot amin
 * alkalmazzuk ezt a decorator-t
 */
export function DlcInput<E>(cmpId?: string, overridePropertyKey?: string) {
  return (target: any, propertyKey: string | symbol) => {
    // read original version
    let val = target[propertyKey] as E;
    // new getter
    const getter = function (): E {
      return val;
    };
    const changeConfig = {
      originalPropertyKey: propertyKey,
      propertyKey: overridePropertyKey ?? propertyKey,
      changeCallbacks: [],
      cmpId,
    } as DlcInputConfig<E>;
    // new setter
    const setter = function (newVal: E) {
      val = newVal;
      changeConfig.changeCallbacks.length > 0 && changeConfig.changeCallbacks.forEach((conf) => conf.cb(val));
    };
    // replace old getter and setter to overrided version
    if (delete target[propertyKey]) {
      Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
      });
    }
    // store meta datas
    const configs = Reflect.get(target, DLC__INPUTS_CONFIGS) || [];
    configs.push(changeConfig);
    Reflect.set(target, DLC__INPUTS_CONFIGS, configs);
  };
}
