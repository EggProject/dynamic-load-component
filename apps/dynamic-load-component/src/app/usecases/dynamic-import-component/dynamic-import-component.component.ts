import { Component } from '@angular/core';

@Component({
  selector: 'dynamic-load-component-dynamic-import-component',
  templateUrl: './dynamic-import-component.component.html',
})
export class DynamicImportComponentComponent {
  dynamicComponentRefInputs = { title: 'title', title2: 'title2' };

  dynamicComponentLazyRef = () =>
    import('../../dynamic-contents/dynamic-content2/dynamic-content2.component').then(
      (c) => c.DynamicContent2Component
    );
}
