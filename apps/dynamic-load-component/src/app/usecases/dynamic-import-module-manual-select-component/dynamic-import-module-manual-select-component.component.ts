import { Component } from '@angular/core';
import { DynamicContent4Component } from '../../dynamic-contents/dynamic-content4/dynamic-content4.component';

@Component({
  selector: 'dynamic-load-component-dynamic-import-module-manual-select-component',
  templateUrl: './dynamic-import-module-manual-select-component.component.html',
})
export class DynamicImportModuleManualSelectComponentComponent {
  dynamicComponentRefInputs = { title: 'title', title2: 'title2' };
  dynamicComponentRef = DynamicContent4Component;

  dynamicModuleLazyRef = () =>
    import('../../dynamic-contents/dynamic-content4/dynamic-content4.module').then((m) => m.DynamicContent4Module);
}
