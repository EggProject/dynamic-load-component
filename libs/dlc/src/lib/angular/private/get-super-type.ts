import { Type } from '@angular/core';

/**
 * Csak a nekunk szukseges kulcsokat vettuk at
 *
 * original: https://github.com/angular/angular/blob/main/packages/core/src/render3/interfaces/definition.ts#L99
 */
export interface DirectiveDef<T> {
  /**
   * A dictionary mapping the inputs' minified property names to their public API names, which
   * are their aliases if any, or their original unminified property names
   * (as in `@Input('alias') propertyName: any;`).
   */
  readonly inputs: { [P in keyof T]: string };
  /**
   * A dictionary mapping the outputs' minified property names to their public API names, which
   * are their aliases if any, or their original unminified property names
   * (as in `@Output('alias') propertyName: any;`).
   */
  readonly outputs: { [P in keyof T]: string };
}

/**
 * original: https://github.com/angular/angular/blob/main/packages/core/src/render3/interfaces/definition.ts#L227
 */
export type ComponentDef<T> = DirectiveDef<T>;

export function getSuperType<T>(type: Type<T>): Type<T> & { ɵcmp?: ComponentDef<T>; ɵdir?: DirectiveDef<T> } {
  // angular original: return Object.getPrototypeOf(type.prototype).constructor;
  return type;
}
