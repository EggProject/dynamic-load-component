import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Injector,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChange,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, pairwise, skip, startWith, takeUntil } from 'rxjs/operators';
import { ComponentInputs, ComponentOutputs, DLC_HOST_COMPONENT, Inputs, Outputs } from './type';
import { isImplementedNgOnChanges } from './helper';
import { isFunction, isNil } from '@dynamic-load-component/type-guard';
import { deepEqual } from './temp/deep-equal';
import { DLC__INPUTS_CONFIGS, DlcInputConfig } from './decorator/dlc-input/dlc-input.decorator';
import { DLC__BOOTSTRAP_COMPONENT } from './decorator/dlc-bootstrap-component/dlc-bootstrap-component.decorator';
import { isDlcModule } from './module/dlc-module-type';
import { DLC__OUTPUTS_CONFIGS, DlcOutputConfig } from './decorator/dlc-output/dlc-output.decorator';

let id = 0;
/**
 * Base code:
 * https://github.com/ezzabuzaid/dynamic-component-article/blob/main/src/app/dynamic-component.directive.ts
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

const liveIds: string[] = [];

// TODO dynamicOutput
@Directive({
  selector: '[dynamicLoadComponent]',
})
export class DlcDirective implements OnInit, OnDestroy, OnChanges {
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
  @Input() dynamicStaticOutputs?: Outputs = {};
  /**
   * Amikor csak fix ertekeket akarunk atadni.
   *
   * Akkor erdemes hasznalni, ha mar a bind beallitasanal tudjuk az erteket,
   * bar ha valtozik az objektum akkor eszleljuk es tovabbitjuk
   * a dynamic component-nek, de ahhoz mindig uj objektum ref-et kell atadni,
   * ami felhasznaloi oldalrol nem biztos hogy mindig kenyelmes.
   */
  @Input() dynamicStaticInputs?: Inputs = {};

  #id!: string;
  /**
   * hot streams auto unsubscribes
   */
  #onDestroy$ = new Subject();
  #componentFactory?: ComponentFactory<any>;
  #componentRef?: ComponentRef<any>;
  #viewContainerRef: ViewContainerRef;
  #componentFactoryResolver: ComponentFactoryResolver;
  #injector: Injector;
  #el?: ElementRef;
  #hostComponentRef?: Type<any>;
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

  constructor(
    private ngZone: NgZone,
    viewContainerRef: ViewContainerRef,
    componentFactoryResolver: ComponentFactoryResolver,
    injector: Injector,
    @Optional() @Inject(DLC_HOST_COMPONENT) hostComponentRef?: Type<any>,
    @Optional() el?: ElementRef
  ) {
    this.#viewContainerRef = viewContainerRef;
    this.#componentFactoryResolver = componentFactoryResolver;
    this.#injector = injector;
    this.#hostComponentRef = hostComponentRef;
    this.#el = el;
  }

  ngOnInit() {
    // generate unique id
    this.#id = this.dynamicId ?? `${id++}`;
    if (liveIds.indexOf(this.#id) > -1) {
      throw new Error(`Duplicated ids => ${this.#id}`);
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
      if (typeof this.dynamicModule === 'function') {
        // lazy load with module
        componentRefPromise = this.dynamicModule().then((_module) => {
          const module = isDlcModule(_module) ? Reflect.get(_module, DLC__BOOTSTRAP_COMPONENT) : this.dynamicComponent;
          if (isNil(module)) {
            throw new Error('Not found DlcBootstrapComponent or dynamicComponent');
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
      if (isNil(conf?.cmpId) || conf.cmpId === this.#id) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.#dynamicOutputs[conf.outputName] = this.#hostComponentRef[conf.methodName];
      }
    });
    this.validateAndBindOutputs();
  }

  private validateAndBindOutputs() {
    assertNotNullOrUndefined(this.#componentFactory);
    assertNotNullOrUndefined(this.#componentRef);
    this.finifshOutputsSubscription();

    const outputs = { ...(this.dynamicStaticOutputs ?? {}), ...this.#dynamicOutputs };
    if (Object.keys(outputs).length > 0) {
      this.validateOutputs(this.#componentFactory.outputs, outputs, this.#componentRef.instance);
      this.bindOutputs(this.#componentFactory.outputs, outputs, this.#componentRef.instance);
    }
  }

  private initDynamicInputs() {
    const initDynamicInputsValue: Record<string, unknown> = {};
    const cmpInputs = this.#componentFactory?.inputs ?? [];

    this.readAndIterateDynamicInputsValues((conf) => {
      const { changeCallbacks, originalPropertyKey, propertyKey, cmpId } = conf;
      if (isNil(cmpId) || cmpId === this.#id) {
        if (cmpInputs.some((cmpInput) => cmpInput.templateName === propertyKey)) {
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
          throw new Error(`Not found DlcInput binded input => ${originalPropertyKey}`);
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
        .subscribe(([previousValue, currentValue]) => {
          console.log(previousValue, currentValue);
          const componentChanges = this.makeComponentChanges(
            new SimpleChange(
              { ...this.dynamicStaticInputs, ...previousValue },
              { ...this.dynamicStaticInputs, ...currentValue },
              false
            )
          );

          this.commonProcessOnChanges(undefined, componentChanges);
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
    assertNotNullOrUndefined(this.#componentFactory);
    assertNotNullOrUndefined(this.#componentRef);

    if (!isNil(componentChanges) && Object.keys(componentChanges).length > 0) {
      this.validateInputs(this.#componentFactory.inputs, this.dynamicStaticInputs ?? {});
      this.bindInputs(
        this.#componentFactory.inputs,
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
  private createComponent(cmp: Type<any>) {
    this.#componentFactory = this.#componentFactoryResolver.resolveComponentFactory(cmp);
    this.#componentRef = this.#viewContainerRef.createComponent<any>(this.#componentFactory, undefined, this.#injector);
  }

  private bindOutputs(componentOutputs: ComponentInputs, userOutputs: Outputs, componentInstance: any) {
    componentOutputs.forEach((output) =>
      (componentInstance[output.propName] as EventEmitter<never>)
        .pipe(takeUntil(this.#outputsDestroy$))
        .subscribe((event: unknown) => {
          const handler = userOutputs[output.templateName];
          if (handler) {
            // in case the output has not been provided at all
            handler.call(this.#componentRef?.instance, event);
          }
        })
    );
  }

  private bindInputs(componentInputs: ComponentInputs, userInputs: Inputs, componentInstance: any) {
    const userInputsKeys = Object.keys(userInputs);
    componentInputs
      .filter(
        /*ha letezik a valtozasok kozott az input csak akkor foglalkozunk vele*/ (input) =>
          userInputsKeys.indexOf(input.templateName) > -1
      )
      .forEach((input) => {
        componentInstance[input.propName] = userInputs[input.templateName];
      });
  }

  private validateOutputs(componentOutputs: ComponentOutputs, userOutputs: Outputs, componentInstance: any) {
    const userOutputsKeys = Object.keys(userOutputs);
    componentOutputs
      .filter(
        /*ha letezik a valtozasok kozott az input csak akkor foglalkozunk vele*/ (output) =>
          userOutputsKeys.indexOf(output.templateName) > -1
      )
      .forEach((output) => {
        if (!(componentInstance[output.propName] instanceof EventEmitter)) {
          throw new Error(`Output ${output.propName} must be a typeof EventEmitter`);
        }
      });

    const outputsKeys = Object.keys(userOutputs);
    outputsKeys.forEach((key) => {
      const componentHaveThatOutput = componentOutputs.some((output) => output.templateName === key);
      if (!componentHaveThatOutput) {
        throw new Error(`Output ${key} is not ${this.dynamicComponent.name} output.`);
      }
      if (!isFunction(userOutputs[key])) {
        throw new Error(`Output ${key} must be a function`);
      }
    });
  }

  private validateInputs(componentInputs: ComponentInputs, userInputs: Inputs) {
    const userInputsKeys = Object.keys(userInputs);
    userInputsKeys.forEach((userInputKey) => {
      const componentHaveThatInput = componentInputs.some(
        (componentInput) => componentInput.templateName === userInputKey
      );
      if (!componentHaveThatInput) {
        throw new Error(`Input ${userInputKey} is not ${this.dynamicComponent.name} input.`);
      }
    });
  }

  private destroyComponent(recreateOutputsDestroy = true) {
    this.#componentRef?.destroy();
    this.#viewContainerRef.clear();
    this.finifshOutputsSubscription(recreateOutputsDestroy);
  }

  private finifshOutputsSubscription(recreateOutputsDestroy = true) {
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
