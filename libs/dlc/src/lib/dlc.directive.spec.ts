import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { DlcModule } from './dlc.module';
import { fakeAsync, tick } from '@angular/core/testing';
import {
  DynamicContentHostComponent,
  dynamicContentSelector,
  dynamicContentTextElementId1,
  dynamicContentTextElementId2,
  dynamicContentTextElementId3,
  dynamicContentTextElementId4,
} from './test/dlc-directive.test-helpers';
import {
  InputConfigsDynamicComponentHostComponent,
  InputConfigsDynamicComponentLazyHostComponent,
  InputConfigsDynamicInputsWithDlcInputDecoratorHostComponent,
  InputConfigsDynamicModuleHostComponent,
  InputConfigsDynamicModuleWithDynamicComponentHostComponent,
  InputConfigsDynamicOutputsHostComponent,
  InputConfigsDynamicStaticInputsAndDynamicInputsWithDlcInputDecoratorHostComponent,
  InputConfigsDynamicStaticInputsHostComponent,
  ToManyDynamicComponentHostComponent,
  ToManyDynamicInputsWithDlcInputDecoratorHostComponent,
  ToManyDynamicStaticInputsAndDynamicInputsWithDlcInputDecoratorHostComponent,
  ToManyDynamicStaticInputsHostComponent,
} from './test/dlc-directive-test-components';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('DynamicLoadComponentDirective', () => {
  describe('One dlc in view', () => {
    describe('Input configs', () => {
      describe('dynamicComponent', () => {
        let spectator: Spectator<InputConfigsDynamicComponentHostComponent>;

        const createComponent = createComponentFactory({
          disableAnimations: true,
          detectChanges: true,
          component: InputConfigsDynamicComponentHostComponent,
          imports: [DlcModule],
        });

        beforeEach(() => {
          spectator = createComponent();
        });

        it('should renderer dynamic component', () => {
          expect(spectator.query(dynamicContentSelector)).not.toBeNull();
          spectator.detectChanges();
          expect(spectator.query(`#${dynamicContentTextElementId1}`)).not.toBeNull();
          expect(spectator.query(`#${dynamicContentTextElementId2}`)).not.toBeNull();
        });
      });

      describe('dynamicComponentLazy', () => {
        let spectator: Spectator<InputConfigsDynamicComponentLazyHostComponent>;

        const createComponent = createComponentFactory({
          disableAnimations: true,
          detectChanges: true,
          component: InputConfigsDynamicComponentLazyHostComponent,
          imports: [DlcModule],
        });

        beforeEach(() => {
          spectator = createComponent();
        });

        it('should renderer dynamic component', () => {
          expect(spectator.query(dynamicContentSelector)).not.toBeNull();
        });
      });

      describe('dynamicModule with dynamicComponent', () => {
        let spectator: Spectator<InputConfigsDynamicModuleWithDynamicComponentHostComponent>;

        const createComponent = createComponentFactory({
          disableAnimations: true,
          detectChanges: true,
          component: InputConfigsDynamicModuleWithDynamicComponentHostComponent,
          imports: [DlcModule],
        });

        beforeEach(() => {
          spectator = createComponent();
        });

        it('should renderer dynamic component', () => {
          expect(spectator.query(dynamicContentSelector)).not.toBeNull();
        });
      });

      describe('dynamicModule', () => {
        let spectator: Spectator<InputConfigsDynamicModuleHostComponent>;

        const createComponent = createComponentFactory({
          disableAnimations: true,
          detectChanges: true,
          component: InputConfigsDynamicModuleHostComponent,
          imports: [DlcModule],
        });

        beforeEach(() => {
          spectator = createComponent();
        });

        it('should renderer dynamic component', () => {
          expect(spectator.query(dynamicContentSelector)).not.toBeNull();
        });
      });

      describe('dynamicStaticInputs', () => {
        let spectator: Spectator<InputConfigsDynamicStaticInputsHostComponent>;

        const createComponent = createComponentFactory({
          disableAnimations: true,
          detectChanges: true,
          component: InputConfigsDynamicStaticInputsHostComponent,
          imports: [DlcModule],
        });

        beforeEach(() => {
          spectator = createComponent();
        });

        it('should renderer dynamic component', () => {
          spectator.detectChanges();
          expect(spectator.query(`#${dynamicContentTextElementId1}`)?.textContent).toEqual(
            spectator.component.staticInputs.testText
          );
        });

        it('should change input value', () => {
          spectator.detectChanges();
          spectator.component.staticInputs = { testText: 'valami' };
          spectator.detectChanges();
          expect(spectator.query(`#${dynamicContentTextElementId1}`)?.textContent).toEqual(
            spectator.component.staticInputs.testText
          );
        });
      });

      describe('dynamicInputs with DlcInput decorator', () => {
        let spectator: Spectator<InputConfigsDynamicInputsWithDlcInputDecoratorHostComponent>;

        const createComponent = createComponentFactory({
          disableAnimations: true,
          detectChanges: true,
          component: InputConfigsDynamicInputsWithDlcInputDecoratorHostComponent,
          imports: [DlcModule],
        });

        beforeEach(() => {
          spectator = createComponent();
        });

        it('should renderer dynamic component', () => {
          spectator.detectChanges();
          expect(spectator.query(`#${dynamicContentTextElementId1}`)?.textContent).toEqual(
            spectator.component.testText
          );
        });

        it('should change input value', fakeAsync(() => {
          spectator.detectChanges();
          spectator.component.testText = 'valami';
          tick(300);
          spectator.fixture.whenStable().then(() => {
            spectator.detectChanges();
            expect(spectator.query(`#${dynamicContentTextElementId1}`)?.textContent).toEqual(
              spectator.component.testText
            );
          });
        }));
      });

      describe('dynamicStaticInputs and dynamicInputs with DlcInput decorator', () => {
        let spectator: Spectator<InputConfigsDynamicStaticInputsAndDynamicInputsWithDlcInputDecoratorHostComponent>;

        const createComponent = createComponentFactory({
          disableAnimations: true,
          detectChanges: true,
          component: InputConfigsDynamicStaticInputsAndDynamicInputsWithDlcInputDecoratorHostComponent,
          imports: [DlcModule],
        });

        beforeEach(() => {
          spectator = createComponent();
        });

        it('should renderer dynamic component', () => {
          spectator.detectChanges();
          expect(spectator.query(`#${dynamicContentTextElementId2}`)?.textContent).toEqual(
            spectator.component.staticInputs.testText2
          );
          expect(spectator.query(`#${dynamicContentTextElementId1}`)?.textContent).toEqual(
            spectator.component.testText
          );
        });

        it('should change input value', fakeAsync(() => {
          spectator.detectChanges();
          spectator.component.testText = 'valami';
          spectator.component.staticInputs = { testText2: 'valami' };
          tick(300);
          spectator.fixture.whenStable().then(() => {
            spectator.detectChanges();
            expect(spectator.query(`#${dynamicContentTextElementId1}`)?.textContent).toEqual(
              spectator.component.testText
            );
            expect(spectator.query(`#${dynamicContentTextElementId2}`)?.textContent).toEqual(
              spectator.component.staticInputs.testText2
            );
          });
        }));
      });
    });

    describe('dynamicOutputs', () => {
      let spectator: Spectator<InputConfigsDynamicOutputsHostComponent>;

      const createComponent = createComponentFactory({
        disableAnimations: true,
        detectChanges: true,
        component: InputConfigsDynamicOutputsHostComponent,
        imports: [DlcModule],
      });

      beforeEach(() => {
        spectator = createComponent();
      });

      it('test output', () => {
        spectator.detectChanges();
        spectator.click(`#${dynamicContentTextElementId1}`);
        expect(spectator.component.outputs.testEvent).toBeCalledTimes(1);
      });
    });

    describe('test onChanges', () => {
      let spectator: Spectator<InputConfigsDynamicStaticInputsHostComponent>;
      let spy: jest.SpyInstance<any>;

      const createComponent = createComponentFactory({
        disableAnimations: true,
        detectChanges: true,
        component: InputConfigsDynamicStaticInputsHostComponent,
        imports: [DlcModule],
      });

      beforeEach(() => {
        spy = jest.spyOn(DynamicContentHostComponent.prototype, 'ngOnChanges');
        spectator = createComponent();
      });

      afterEach(() => {
        spy.mockReset();
      });

      it('should call ngOnChanges', () => {
        spectator.detectChanges();
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('To many dlc in view', () => {
    describe('Input configs', () => {
      describe('dynamicComponent', () => {
        let spectator: Spectator<ToManyDynamicComponentHostComponent>;

        const createComponent = createComponentFactory({
          disableAnimations: true,
          detectChanges: true,
          component: ToManyDynamicComponentHostComponent,
          imports: [DlcModule],
        });

        beforeEach(() => {
          spectator = createComponent();
        });

        it('should renderer dynamic component', () => {
          spectator.detectChanges();
          expect(spectator.query(`#${dynamicContentTextElementId1}`)).not.toBeNull();
          expect(spectator.query(`#${dynamicContentTextElementId2}`)).not.toBeNull();
          expect(spectator.query(`#${dynamicContentTextElementId3}`)).not.toBeNull();
          expect(spectator.query(`#${dynamicContentTextElementId4}`)).not.toBeNull();
        });
      });

      describe('dynamicStaticInputs', () => {
        let spectator: Spectator<ToManyDynamicStaticInputsHostComponent>;

        const createComponent = createComponentFactory({
          disableAnimations: true,
          detectChanges: true,
          component: ToManyDynamicStaticInputsHostComponent,
          imports: [DlcModule],
        });

        beforeEach(() => {
          spectator = createComponent();
        });

        it('should renderer dynamic component', () => {
          spectator.detectChanges();
          expect(spectator.query(`#${dynamicContentTextElementId1}`)?.textContent).toEqual(
            spectator.component.staticInputs.testText
          );
          expect(spectator.query(`#${dynamicContentTextElementId3}`)?.textContent).toEqual(
            spectator.component.staticInputs.testText
          );
        });

        it('should change input value', () => {
          spectator.detectChanges();
          spectator.component.staticInputs = { testText: 'valami' };
          spectator.detectChanges();
          expect(spectator.query(`#${dynamicContentTextElementId1}`)?.textContent).toEqual(
            spectator.component.staticInputs.testText
          );
          expect(spectator.query(`#${dynamicContentTextElementId1}`)?.textContent).toEqual(
            spectator.component.staticInputs.testText
          );
          expect(spectator.query(`#${dynamicContentTextElementId3}`)?.textContent).toEqual(
            spectator.component.staticInputs.testText
          );
        });
      });

      describe('dynamicInputs with DlcInput decorator', () => {
        let spectator: Spectator<ToManyDynamicInputsWithDlcInputDecoratorHostComponent>;

        const createComponent = createComponentFactory({
          disableAnimations: true,
          detectChanges: true,
          component: ToManyDynamicInputsWithDlcInputDecoratorHostComponent,
          imports: [DlcModule],
        });

        beforeEach(() => {
          spectator = createComponent();
        });

        it('should renderer dynamic component', () => {
          spectator.detectChanges();
          expect(spectator.query(`#${dynamicContentTextElementId1}`)?.textContent).toEqual(
            spectator.component.testText
          );
          expect(spectator.query(`#${dynamicContentTextElementId3}`)?.textContent).toEqual(
            spectator.component.testText
          );
        });

        it('should change input value', fakeAsync(() => {
          spectator.detectChanges();
          spectator.component.testText = 'valami';
          spectator.component.testText2_1 = 'valami';
          spectator.component.testText2_2 = 'valami';
          tick(300);
          spectator.fixture.whenStable().then(() => {
            spectator.detectChanges();
            expect(spectator.query(`#${dynamicContentTextElementId1}`)?.textContent).toEqual(
              spectator.component.testText
            );
            expect(spectator.query(`#${dynamicContentTextElementId2}`)?.textContent).toEqual(
              spectator.component.testText2_1
            );
            expect(spectator.query(`#${dynamicContentTextElementId3}`)?.textContent).toEqual(
              spectator.component.testText
            );
            expect(spectator.query(`#${dynamicContentTextElementId4}`)?.textContent).toEqual(
              spectator.component.testText2_2
            );
          });
        }));
      });

      describe('dynamicStaticInputs and dynamicInputs with DlcInput decorator', () => {
        let spectator: Spectator<ToManyDynamicStaticInputsAndDynamicInputsWithDlcInputDecoratorHostComponent>;

        const createComponent = createComponentFactory({
          disableAnimations: true,
          detectChanges: true,
          component: ToManyDynamicStaticInputsAndDynamicInputsWithDlcInputDecoratorHostComponent,
          imports: [DlcModule],
        });

        beforeEach(() => {
          spectator = createComponent();
        });

        it('should renderer dynamic component', () => {
          spectator.detectChanges();
          expect(spectator.query(`#${dynamicContentTextElementId1}`)?.textContent).toEqual(
            spectator.component.testText
          );
          expect(spectator.query(`#${dynamicContentTextElementId2}`)?.textContent).toEqual(
            spectator.component.staticInputs.testText2
          );
          expect(spectator.query(`#${dynamicContentTextElementId3}`)?.textContent).toEqual(
            spectator.component.testText
          );
          expect(spectator.query(`#${dynamicContentTextElementId4}`)?.textContent).toEqual(
            spectator.component.staticInputs.testText2
          );
        });

        it('should change input value', fakeAsync(() => {
          spectator.detectChanges();
          spectator.component.testText = 'valami';
          spectator.component.staticInputs = { testText2: 'valami' };
          tick(300);
          spectator.fixture.whenStable().then(() => {
            spectator.detectChanges();
            expect(spectator.query(`#${dynamicContentTextElementId1}`)?.textContent).toEqual(
              spectator.component.testText
            );
            expect(spectator.query(`#${dynamicContentTextElementId2}`)?.textContent).toEqual(
              spectator.component.staticInputs.testText2
            );
            expect(spectator.query(`#${dynamicContentTextElementId3}`)?.textContent).toEqual(
              spectator.component.testText
            );
            expect(spectator.query(`#${dynamicContentTextElementId4}`)?.textContent).toEqual(
              spectator.component.staticInputs.testText2
            );
          });
        }));
      });
    });
  });
});
