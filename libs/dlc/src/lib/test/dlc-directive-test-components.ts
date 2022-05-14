/* eslint-disable */

import { Component } from '@angular/core';
import { DlcInput } from '../decorator/dlc-input/dlc-input.decorator';
import { setDlcHostComponentProvider } from '../type';
import {
  DynamicContent2HostComponent,
  DynamicContentHostComponent,
  DynamicContentHostModuleWithoutDlcBootstrapComponentDecorator,
} from './dlc-directive.test-helpers';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'component-input-host',
  template: ` <ng-template dynamicLoadComponent [dynamicComponent]="dynamicComponentRef"></ng-template>`,
})
export class InputConfigsDynamicComponentHostComponent {
  dynamicComponentRef = DynamicContentHostComponent;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'component-input-host',
  template: ` <ng-template dynamicLoadComponent [dynamicComponentLazy]="dynamicComponentRefLazy"></ng-template>`,
})
export class InputConfigsDynamicComponentLazyHostComponent {
  dynamicComponentRefLazy = () => import('./dlc-directive.test-helpers').then((c) => c.DynamicContentHostComponent);
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'component-input-host',
  template: ` <ng-template
    dynamicLoadComponent
    [dynamicComponent]="dynamicComponentRef"
    [dynamicModule]="dynamicModule"
  ></ng-template>`,
})
export class InputConfigsDynamicModuleWithDynamicComponentHostComponent {
  dynamicComponentRef = DynamicContentHostComponent;
  dynamicModule = () => import('./dlc-directive.test-helpers').then((m) => m.DynamicContentHostModule);
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'component-input-host',
  template: ` <ng-template dynamicLoadComponent [dynamicModule]="dynamicModule"></ng-template>`,
})
export class InputConfigsDynamicModuleHostComponent {
  dynamicModule = () => import('./dlc-directive.test-helpers').then((m) => m.DynamicContentHostModule2);
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'component-input-host',
  template: `<ng-template
    dynamicLoadComponent
    [dynamicModule]="dynamicModule"
    [dynamicStaticInputs]="staticInputs"
  ></ng-template>`,
})
export class InputConfigsDynamicStaticInputsHostComponent {
  staticInputs = { testText: 'ertek' };
  dynamicModule = () => import('./dlc-directive.test-helpers').then((m) => m.DynamicContentHostModule2);
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'component-input-host',
  template: ` <ng-template dynamicLoadComponent [dynamicModule]="dynamicModule"></ng-template>`,
  providers: [setDlcHostComponentProvider(InputConfigsDynamicInputsWithDlcInputDecoratorHostComponent)],
})
export class InputConfigsDynamicInputsWithDlcInputDecoratorHostComponent {
  @DlcInput() testText = 'ertek';
  dynamicModule = () => import('./dlc-directive.test-helpers').then((m) => m.DynamicContentHostModule2);
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'component-input-host',
  template: ` <ng-template
    dynamicLoadComponent
    [dynamicStaticInputs]="staticInputs"
    [dynamicModule]="dynamicModule"
  ></ng-template>`,
  providers: [
    setDlcHostComponentProvider(InputConfigsDynamicStaticInputsAndDynamicInputsWithDlcInputDecoratorHostComponent),
  ],
})
export class InputConfigsDynamicStaticInputsAndDynamicInputsWithDlcInputDecoratorHostComponent {
  @DlcInput() testText = 'ertek';
  staticInputs = { testText2: 'ertek' };
  dynamicModule = () => import('./dlc-directive.test-helpers').then((m) => m.DynamicContentHostModule2);
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'component-input-host',
  template: ` <ng-template
    dynamicLoadComponent
    [dynamicModule]="dynamicModule"
    [dynamicStaticOutputs]="outputs"
  ></ng-template>`,
})
export class InputConfigsDynamicOutputsHostComponent {
  outputs = { testEvent: jest.fn() };
  dynamicModule = () => import('./dlc-directive.test-helpers').then((m) => m.DynamicContentHostModule2);
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'component-input-host',
  template: ` <ng-template dynamicLoadComponent [dynamicComponent]="dynamicComponentRef1"></ng-template>
    <ng-template dynamicLoadComponent [dynamicComponent]="dynamicComponentRef2"></ng-template>`,
})
export class ToManyDynamicComponentHostComponent {
  dynamicComponentRef1 = DynamicContentHostComponent;
  dynamicComponentRef2 = DynamicContent2HostComponent;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'component-input-host',
  template: `<ng-template
      dynamicLoadComponent
      [dynamicModule]="dynamicModule1"
      [dynamicStaticInputs]="staticInputs"
    ></ng-template>
    <ng-template
      dynamicLoadComponent
      [dynamicModule]="dynamicModule2"
      [dynamicStaticInputs]="staticInputs"
    ></ng-template>`,
})
export class ToManyDynamicStaticInputsHostComponent {
  staticInputs = { testText: 'ertek' };
  dynamicModule1 = () => import('./dlc-directive.test-helpers').then((m) => m.DynamicContentHostModule2);
  dynamicModule2 = () => import('./dlc-directive.test-helpers').then((m) => m.DynamicContentHostModule4);
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'component-input-host',
  template: `<ng-template
      dynamicLoadComponent
      [dynamicStaticInputs]="staticInputs"
      [dynamicModule]="dynamicModule1"
    ></ng-template
    ><ng-template
      dynamicLoadComponent
      [dynamicStaticInputs]="staticInputs"
      [dynamicModule]="dynamicModule2"
    ></ng-template>`,
  providers: [setDlcHostComponentProvider(ToManyDynamicStaticInputsAndDynamicInputsWithDlcInputDecoratorHostComponent)],
})
export class ToManyDynamicStaticInputsAndDynamicInputsWithDlcInputDecoratorHostComponent {
  @DlcInput() testText = 'ertek';
  staticInputs = { testText2: 'ertek' };
  dynamicModule1 = () => import('./dlc-directive.test-helpers').then((m) => m.DynamicContentHostModule2);
  dynamicModule2 = () => import('./dlc-directive.test-helpers').then((m) => m.DynamicContentHostModule4);
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'component-input-host',
  template: `<ng-template dynamicLoadComponent [dynamicId]="id1" [dynamicModule]="dynamicModule1"></ng-template
    ><ng-template dynamicLoadComponent [dynamicId]="id2" [dynamicModule]="dynamicModule2"></ng-template>`,
  providers: [setDlcHostComponentProvider(ToManyDynamicInputsWithDlcInputDecoratorHostComponent)],
})
export class ToManyDynamicInputsWithDlcInputDecoratorHostComponent {
  id1 = 'id1';
  id2 = 'id2';
  @DlcInput() testText = 'ertek';
  @DlcInput('id1', 'testText2') testText2_1 = 'ertek';
  @DlcInput('id2', 'testText2') testText2_2 = 'ertek';
  dynamicModule1 = () => import('./dlc-directive.test-helpers').then((m) => m.DynamicContentHostModule2);
  dynamicModule2 = () => import('./dlc-directive.test-helpers').then((m) => m.DynamicContentHostModule4);
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'component-input-host',
  template: `<ng-template dynamicLoadComponent [dynamicComponent]="dynamicComponentRef1" [dynamicId]="id"></ng-template>
    <ng-template dynamicLoadComponent [dynamicComponent]="dynamicComponentRef2" [dynamicId]="id"></ng-template>`,
})
export class ToManyDynamicComponentCheckUniqIdHostComponent {
  id = 'id';
  dynamicComponentRef1 = DynamicContentHostComponent;
  dynamicComponentRef2 = DynamicContent2HostComponent;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'component-input-host',
  template: `<ng-template dynamicLoadComponent [dynamicModule]="dynamicModule1"></ng-template>`,
})
export class ToManyDynamicComponentCheckWithoutDlcBootstrapComponentDecoratorHostComponent {
  dynamicModule1 = () =>
    import('./dlc-directive.test-helpers').then((m) => m.DynamicContentHostModuleWithoutDlcBootstrapComponentDecorator);
}
