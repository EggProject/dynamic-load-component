import { Component } from '@angular/core';
import { DlcInput, setDlcHostComponentProvider } from '@dynamic-load-component/dlc';
import { timer } from 'rxjs';

const lazyCmp1 = 'lazyCmp1';

@Component({
  selector: 'dynamic-load-component-dynamic-import-inputs',
  templateUrl: './dynamic-import-inputs.component.html',
  providers: [setDlcHostComponentProvider(DynamicImportInputsComponent)],
})
export class DynamicImportInputsComponent {
  dynamicComponentRefInputs = { title: 'title from static', title2: 'title2 from static' };

  @DlcInput()
  title2 = 'title2 from dynamic';

  @DlcInput(lazyCmp1)
  title3 = 'title3 from dynamic';

  @DlcInput(undefined, 'title4')
  something = 'title4 from dynamic';

  readonly lazyCmp1Id = lazyCmp1;

  dynamicModuleLazyRef = () =>
    import('../../dynamic-contents/dynamic-content5/dynamic-content5.module').then((m) => m.DynamicContent5Module);

  constructor() {
    timer(3000, 3000).subscribe((tick) => (this.title3 = `tick: ${tick}`));
  }
}
