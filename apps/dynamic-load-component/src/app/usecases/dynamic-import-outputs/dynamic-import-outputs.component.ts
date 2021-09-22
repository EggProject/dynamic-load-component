import { Component } from '@angular/core';
import { DlcOutput, setDlcHostComponentProvider } from '@dynamic-load-component/dlc';

const lazyCmp1 = 'lazyCmp1';

@Component({
  selector: 'dynamic-load-component-dynamic-import-outputs',
  templateUrl: './dynamic-import-outputs.component.html',
  providers: [setDlcHostComponentProvider(DynamicImportOutputsComponent)],
})
export class DynamicImportOutputsComponent {
  readonly lazyCmp1Id = lazyCmp1;

  dynamicModuleLazyRef = () =>
    import('../../dynamic-contents/dynamic-content5/dynamic-content5.module').then((m) => m.DynamicContent5Module);

  @DlcOutput('testOutput')
  testOutputHandler($event: number) {
    console.log('testOutputHandler', $event);
  }
}
