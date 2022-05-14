import {
  ComponentRef,
  Directive,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChange,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, pairwise, skip, startWith, takeUntil } from 'rxjs/operators';
import { isImplementedNgOnChanges } from './helper';
import { isFunction, isNil } from '@dynamic-load-component/type-guard';
import { deepEqual } from './temp/deep-equal';
import { DLC__INPUTS_CONFIGS, DlcInputConfig } from './decorator/dlc-input/dlc-input.decorator';
import { DLC__BOOTSTRAP_COMPONENT } from './decorator/dlc-bootstrap-component/dlc-bootstrap-component.decorator';
import { isDlcModule } from './module/dlc-module-type';
import { DLC__OUTPUTS_CONFIGS, DlcOutputConfig } from './decorator/dlc-output/dlc-output.decorator';
import { DirectiveDef, getSuperType } from './angular/private/get-super-type';
import { DLC_HOST_COMPONENT, UserInputs, UserOutputs } from './type';

let id = 0;
/**
 * Base code:
 * https://github.com/ezzabuzaid/dynamic-component-article/blob/main/src/app/dynamic-component.directive.ts
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

const liveIds: string[] = [];

export const generateErrorMessageDuplicateIds = (id: string) => `Duplicated ids => ${id}`;
export const NOT_FOUND_DLC_BOOTSTRAP_COMPONENT_OR_DYNAMIC_COMPONENT =
  'Not found DlcBootstrapComponent or dynamicComponent';

/**
 * TODO dynamicOutput
 * TODO comment code
 */
@Directive({
  selector: '[dynamicLoadComponent]',
})
export class DlcDirective<C = any> implements OnInit, OnDestroy, OnChanges {
  @Input() dynamicId?: string;
  /**
   * Sima component betoltes
   */
  @Input() dynamicComponent!: Type<any>;
  /**
   * Lazy load component
   */
  @Input() dynamicComponentLazy!: () => Promise<any>;
  /**
   * Megadhatunk module-t is.
   * Ebben az esetben ha meg van adva a dynamicComponent, akkor azt keressuk,
   * ha nem akkor a `DlcModuleDef` implementalnunk kell
   * es az abban megadott referenciak alapjan toltjuk be a component-et.
   *
   * Hasznalat pl(ugyan ugy mint amikor egy lazy route-t definialsz):
   * `()=>import('modulepath').then(m=>m.MODULE)`
   */
  @Input() dynamicModule!: () => Promise<any>;
  @Input() dynamicStaticOutputs?: UserOutputs = {};
  /**
   * Amikor csak fix ertekeket akarunk atadni.
   *
   * Akkor erdemes hasznalni, ha mar a bind beallitasanal tudjuk az erteket,
   * bar ha valtozik az objektum akkor eszleljuk es tovabbitjuk
   * a dynamic component-nek, de ahhoz mindig uj objektum ref-et kell atadni,
   * ami felhasznaloi oldalrol nem biztos hogy mindig kenyelmes.
   */
  @Input() dynamicStaticInputs?: UserInputs = {};

  @Output() componentRef = new EventEmitter<any>();

  #id!: string;
  /**
   * hot streams auto unsubscribes
   */
  #onDestroy$ = new Subject<void>();
  #componentRef!: ComponentRef<C>;
  #viewContainerRef: ViewContainerRef;
  #injector: Injector;
  #hostComponentRef?: Type<C>;
  /**
   * `DlcInput` decoratorral ellatot inputok erteket taroljuk benne.
   */
  #dynamicInputsChanges$ = new BehaviorSubject<Record<string, unknown>>({});
  #dynamicInputsChangesSubscription!: Subscription;
  /**
   * Dynamic input inited flag
   */
  #initedDynamicInputsAndOutputs = false;
  #outputsDestroy$ = new Subject<void>();
  #dynamicOutputs: Record<string, (event: unknown) => void> = {};
  #cmpDefinedInputs: DirectiveDef<C>['inputs'] | null = null;
  #cmpDefinedOutputs: DirectiveDef<C>['outputs'] | null = null;

  constructor(
    viewContainerRef: ViewContainerRef,
    injector: Injector,
    @Optional() @Inject(DLC_HOST_COMPONENT) hostComponentRef?: Type<any>
  ) {
    this.#viewContainerRef = viewContainerRef;
    this.#injector = injector;
    this.#hostComponentRef = hostComponentRef;
  }

  ngOnInit() {
    // generate unique id
    this.#id = this.dynamicId ?? `${id++}`;
    if (liveIds.indexOf(this.#id) > -1) {
      throw new Error(generateErrorMessageDuplicateIds(this.#id));
    }
    liveIds.push(this.#id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    let componentChanges: Record<string, SimpleChange>;
    const shouldCreateNewComponent =
      changes.dynamicComponent?.previousValue !== changes.dynamicComponent?.currentValue ||
      changes.dynamicComponentLazy?.previousValue !== changes.dynamicComponentLazy?.currentValue ||
      changes.dynamicModule?.previousValue !== changes.dynamicModule?.currentValue;

    if (shouldCreateNewComponent) {
      let componentRefPromise: Promise<Type<any>>;
      if (isFunction(this.dynamicModule)) {
        // lazy load with module
        componentRefPromise = this.dynamicModule().then((_module) => {
          const module = isDlcModule(_module) ? Reflect.get(_module, DLC__BOOTSTRAP_COMPONENT) : this.dynamicComponent;
          if (isNil(module)) {
            throw new Error(NOT_FOUND_DLC_BOOTSTRAP_COMPONENT_OR_DYNAMIC_COMPONENT);
          }
          return module;
        });
      } else {
        if (isFunction(this.dynamicComponentLazy)) {
          // lazy load component
          componentRefPromise = this.dynamicComponentLazy();
        } else {
          // simple load component
          componentRefPromise = Promise.resolve(this.dynamicComponent);
        }
      }
      componentRefPromise.then((cmp) => {
        assertNotNullOrUndefined(cmp);

        this.destroyComponent();
        this.createComponent(cmp);
        // merge static and dynamic inputs and init outputs
        const staticInputs = this.initInputsAndOutputs(changes);
        componentChanges = this.makeComponentChanges(staticInputs, true);
        this.commonProcessOnChanges(changes, componentChanges, true);
        this.componentRef.emit(this.#componentRef?.instance);
      });
    } else {
      // ha static input valtozik akkor emulaljuk az onchanges esemenyeket
      componentChanges ??= this.makeComponentChanges(changes?.dynamicStaticInputs);
      this.commonProcessOnChanges(changes, componentChanges);
    }
  }

  ngOnDestroy(): void {
    // remove my dynamic input callbacks
    this.readAndIterateDynamicInputsValues((conf) => {
      const { changeCallbacks } = conf;
      const foundIndex = changeCallbacks.findIndex((config) => config.id === this.#id);
      changeCallbacks.splice(foundIndex, 1);
    });
    // destroy me
    this.#onDestroy$.next();
    this.#onDestroy$.complete();
    // destroy dynamic component
    this.destroyComponent(false);
    //
    liveIds.splice(liveIds.indexOf(this.#id), 1);
  }

  /**
   * Ha meg van adva a `hostComponentRef` es van `DlcInput`
   * decoratorral ellatott property, akkor minden egyet DlcInput config-val
   * vissza hivjuk a cb-t, ha a feltetelek nem teljesulnek akkor nem tortenik semmi
   */
  private readAndIterateDynamicInputsValues(cb: (conf: DlcInputConfig<unknown>) => void) {
    this.readAndIterateDynamicComponentDecoratorValues(cb, DLC__INPUTS_CONFIGS);
  }

  private readAndIterateDynamicOutputsValues(cb: (conf: DlcOutputConfig) => void) {
    this.readAndIterateDynamicComponentDecoratorValues(cb, DLC__OUTPUTS_CONFIGS);
  }

  private readAndIterateDynamicComponentDecoratorValues<T>(cb: (conf: T) => void, configKey: symbol) {
    if (!isNil(this.#hostComponentRef)) {
      const configs = Reflect.get(this.#hostComponentRef, configKey) as T[];

      if (Array.isArray(configs) && configs.length > 0) {
        configs.forEach((conf) => cb(conf));
      }
    }
  }

  /**
   * Input-k beallitasa.
   * Jellemzoen a legelso onChanges esemenynel hivodik meg tovabba
   * minden static input valtozasnal.
   */
  private initInputsAndOutputs(changes: SimpleChanges) {
    if (!isNil(this.#dynamicInputsChangesSubscription) && this.#dynamicInputsChangesSubscription.closed === false) {
      /**
       * ha valtozik a config es mar volt init akkor leiratkozunk az elozorol,
       */
      this.#dynamicInputsChangesSubscription.unsubscribe();
    }

    const staticInputs: SimpleChange = changes?.dynamicStaticInputs || new SimpleChange(false, {}, true);
    this.initDynamicInputsAndOutputs();
    staticInputs.currentValue = { ...staticInputs.currentValue, ...this.#dynamicInputsChanges$.getValue() };
    return staticInputs;
  }

  /**
   * Egyszer fog csak lefutni a hivasok szamatol fuggetlenul, mivel dinamikusan
   * nem lehet egy objecthez hozzaadni property-t decoratorral.
   * (lehetne, de nagyon nagyon nagy hack lenne es felesleges igy nem keszulunk
   * fel ra!)
   */
  private initDynamicInputsAndOutputs() {
    if (this.#initedDynamicInputsAndOutputs === false) {
      this.#initedDynamicInputsAndOutputs = true;
      this.initDynamicInputs();
      this.initDynamicOutputs();
    }
  }

  private initDynamicOutputs() {
    this.readAndIterateDynamicOutputsValues((conf) => {
      if ((isNil(conf?.cmpId) || conf.cmpId === this.#id) && !isNil(this.#hostComponentRef)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.#dynamicOutputs[conf.outputName] = this.#hostComponentRef[conf.methodName];
      }
    });
    this.validateAndBindOutputs();
  }

  private validateAndBindOutputs() {
    assertNotNullOrUndefined(this.#componentRef);
    this.finishOutputsSubscription();

    const outputs = { ...(this.dynamicStaticOutputs ?? {}), ...this.#dynamicOutputs };
    if (Object.keys(outputs).length > 0) {
      this.validateOutputs(this.#cmpDefinedOutputs, outputs, this.#componentRef.instance);
      this.bindOutputs(this.#cmpDefinedOutputs, outputs, this.#componentRef.instance);
    }
  }

  /**
   * DlcInput -ok felolvasasa
   */
  private initDynamicInputs() {
    const initDynamicInputsValue: Record<string, unknown> = {};
    this.readAndIterateDynamicInputsValues((conf) => {
      const { changeCallbacks, originalPropertyKey, propertyKey, cmpId } = conf;
      if (isNil(cmpId) || cmpId === this.#id) {
        /**
         * Megnezzuk hogy letezik-e az input
         */
        if (Object.prototype.hasOwnProperty.call(this.#cmpDefinedInputs, propertyKey)) {
          // Attach(bind) dynamic input handler
          changeCallbacks.push({
            id: this.#id,
            cb: (newVal: unknown) =>
              this.#dynamicInputsChanges$.next({
                ...this.#dynamicInputsChanges$.getValue(),
                [propertyKey]: newVal,
              }),
          });
          initDynamicInputsValue[propertyKey] = (this.#hostComponentRef as any)[originalPropertyKey];
        } else {
          throw new Error(`Not found DlcInput input => ${originalPropertyKey}`);
        }
      }
    });

    if (Object.keys(initDynamicInputsValue).length > 0) {
      // init first value
      this.#dynamicInputsChanges$.next({
        ...this.#dynamicInputsChanges$.getValue(),
        ...initDynamicInputsValue,
      });

      // Attach dynamicInputs change detector stream
      this.#dynamicInputsChangesSubscription = this.#dynamicInputsChanges$
        .pipe(
          // TODO ha bekotom, akkor a tesztek elbuknak :( lehet doksiban kene leirni hogy erre figyeljen a felhasznalo
          // debounceTime(300),
          distinctUntilChanged((_old, _new) => deepEqual(_old, _new)),
          startWith(undefined),
          pairwise(),
          skip(1),
          takeUntil(this.#onDestroy$)
        )
        .subscribe({
          next: ([previousValue, currentValue]) => {
            const componentChanges = this.makeComponentChanges(
              new SimpleChange(
                { ...this.dynamicStaticInputs, ...previousValue },
                { ...this.dynamicStaticInputs, ...currentValue },
                false
              )
            );

            this.commonProcessOnChanges(undefined, componentChanges);
          },
        });
    }
  }

  /**
   * Olyan muveletek amiket mindig el kell vegezni egy onChanges esemeny eseten
   */
  private commonProcessOnChanges(
    changes?: SimpleChanges,
    componentChanges?: Record<string, SimpleChange>,
    firstChange = false
  ) {
    assertNotNullOrUndefined(this.#componentRef);

    if (!isNil(componentChanges) && Object.keys(componentChanges).length > 0) {
      this.validateInputs(this.#cmpDefinedInputs, this.dynamicStaticInputs ?? {});
      this.bindInputs(
        this.#cmpDefinedInputs,
        Object.entries(componentChanges).reduce((curr, next) => {
          curr[next[0]] = next[1].currentValue;
          return curr;
        }, {} as Record<string, unknown>) ?? {},
        this.#componentRef.instance
      );
    }

    if (firstChange === false && changes?.dynamicStaticOutputs) {
      this.validateAndBindOutputs();
    }
    const componentInstance = this.#componentRef.instance as Partial<OnChanges>;
    if (!isNil(componentChanges) && isImplementedNgOnChanges(componentInstance)) {
      componentInstance.ngOnChanges(componentChanges);
    }
  }

  /**
   * `SimpleChanges` emulalasa
   *
   * inputsChange eseten egy objektumot tarolunk benne amiben kulcs ertek
   * parok megfelelnek az input nev ertek parosnak
   */
  private makeComponentChanges(inputsChange?: SimpleChange, firstChange = false): Record<string, SimpleChange> {
    if (isNil(inputsChange)) {
      return {};
    }
    const previuosInputs = inputsChange.previousValue ?? {};
    const currentInputs = inputsChange.currentValue ?? {};
    return Object.keys(currentInputs).reduce((acc, inputName) => {
      const currentInputValue = currentInputs[inputName];
      const previuosInputValue = previuosInputs[inputName];
      if (currentInputValue !== previuosInputValue) {
        acc[inputName] = new SimpleChange(firstChange ? undefined : previuosInputValue, currentInputValue, firstChange);
      }
      return acc;
    }, {} as Record<string, SimpleChange>);
  }

  /**
   * On the fly create component by component reference
   */
  private createComponent(cmp: Type<C>) {
    this.#componentRef = this.#viewContainerRef.createComponent(cmp, { injector: this.#injector });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { inputs, outputs } = getSuperType<C>(this.#componentRef.componentType).ɵcmp!;
    this.#cmpDefinedInputs = inputs;
    this.#cmpDefinedOutputs = outputs;
  }

  private bindOutputs(
    componentOutputs: DirectiveDef<C>['inputs'] | null,
    userOutputs: UserOutputs,
    componentInstance: any
  ) {
    if (componentOutputs === null) {
      if (Object.keys(userOutputs).length === 0) {
        // TODO ez ne csak warning legyen?
        throw new Error('Not found component outputs, but declared user outputs');
      }
      return;
    }
    (Object.keys(componentOutputs) as Extract<keyof DirectiveDef<C>['outputs'], string>[]).forEach((tplOutputKey) =>
      (componentInstance[componentOutputs[tplOutputKey]] as EventEmitter<never>)
        .pipe(takeUntil(this.#outputsDestroy$))
        .subscribe({
          next: (event: unknown) => {
            const handler = userOutputs[tplOutputKey];
            if (handler) {
              // in case the output has not been provided at all
              handler.call(this.#componentRef?.instance, event);
            }
          },
        })
    );
  }

  private bindInputs(
    componentInputs: DirectiveDef<C>['inputs'] | null,
    userInputs: UserInputs,
    componentInstance: any
  ) {
    if (componentInputs === null) {
      if (Object.keys(userInputs).length === 0) {
        // TODO ez ne csak warning legyen?
        throw new Error('Not found component inputs, but declared user inputs');
      }
      return;
    }
    const userInputsKeys = Object.keys(userInputs);
    (Object.keys(componentInputs) as Extract<keyof DirectiveDef<C>['inputs'], string>[])
      .filter(
        /*ha letezik a valtozasok kozott az input csak akkor foglalkozunk vele*/ (tplInputKey) =>
          userInputsKeys.indexOf(tplInputKey) > -1
      )
      .forEach((tplInputKey) => (componentInstance[componentInputs[tplInputKey]] = userInputs[tplInputKey]));
  }

  private validateOutputs(
    componentOutputs: DirectiveDef<C>['outputs'] | null,
    userOutputs: UserOutputs,
    componentInstance: any
  ) {
    if (componentOutputs === null) {
      if (Object.keys(userOutputs).length === 0) {
        // TODO ez ne csak warning legyen?
        throw new Error('Not found component outputs, but declared user outputs');
      }
      return;
    }
    const userOutputsKeys = Object.keys(userOutputs);
    const tplOutputKeys = Object.keys(componentOutputs) as Extract<keyof DirectiveDef<C>['outputs'], string>[];
    tplOutputKeys
      .filter(
        /*ha letezik a valtozasok kozott az input csak akkor foglalkozunk vele*/ (tplOutputKey) =>
          userOutputsKeys.indexOf(tplOutputKey) > -1
      )
      .forEach((tplOutputKey) => {
        const tsOutputKey = componentOutputs[tplOutputKey];
        if (!(componentInstance[tsOutputKey] instanceof Observable)) {
          throw new Error(`Output ${tsOutputKey} must be a typeof EventEmitter`);
        }
      });

    const outputsKeys = Object.keys(userOutputs);
    outputsKeys.forEach((key) => {
      const componentHaveThatOutput = tplOutputKeys.some((tplOutputKey) => tplOutputKey === key);
      if (!componentHaveThatOutput) {
        throw new Error(`Output ${key} is not ${this.dynamicComponent.name} output.`);
      }
      if (!isFunction(userOutputs[key])) {
        throw new Error(`Output ${key} must be a function`);
      }
    });
  }

  private validateInputs(componentInputs: DirectiveDef<C>['inputs'] | null, userInputs: UserInputs) {
    if (componentInputs === null) {
      if (Object.keys(userInputs).length === 0) {
        // TODO ez ne csak warning legyen?
        throw new Error('Not found component inputs, but declared user inputs');
      }
      return;
    }
    const userInputsKeys = Object.keys(userInputs);
    userInputsKeys.forEach((userInputKey) => {
      const componentHaveThatInput = (
        Object.keys(componentInputs) as Extract<keyof DirectiveDef<C>['inputs'], string>[]
      ).some((tplInputName) => tplInputName === userInputKey);

      if (!componentHaveThatInput) {
        throw new Error(`Input ${userInputKey} is not ${this.dynamicComponent.name} input.`);
      }
    });
  }

  private destroyComponent(recreateOutputsDestroy = true) {
    this.#componentRef?.destroy();
    this.#viewContainerRef.clear();
    this.finishOutputsSubscription(recreateOutputsDestroy);
  }

  private finishOutputsSubscription(recreateOutputsDestroy = true) {
    this.#outputsDestroy$.next();
    this.#outputsDestroy$.complete();
    if (recreateOutputsDestroy === true) {
      this.#outputsDestroy$ = new Subject();
    }
  }
}

function assertNotNullOrUndefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(`cannot be undefined or null`);
  }
}
