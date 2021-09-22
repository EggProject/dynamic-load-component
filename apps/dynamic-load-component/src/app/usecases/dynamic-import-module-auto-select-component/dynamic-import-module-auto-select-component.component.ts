import { Component } from '@angular/core';

@Component({
  selector: 'dynamic-load-component-dynamic-import-module-auto-select-component',
  templateUrl: './dynamic-import-module-auto-select-component.component.html',
})
export class DynamicImportModuleAutoSelectComponentComponent {
  dynamicComponentRefInputs = { title: 'title', title2: 'title2' };

  dynamicModuleLazyRef = () =>
    import('../../dynamic-contents/dynamic-content3/dynamic-content3.module').then((m) => m.DynamicContent3Module);
}
