import { Component } from '@angular/core';
import { DlcInput, setDlcHostComponentProvider } from '@dynamic-load-component/dlc';
import { timer } from 'rxjs';

const lazyCmp1 = 'lazyCmp1';
const lazyCmp2 = 'lazyCmp2';

@Component({
  selector: 'dynamic-load-component-dynamic-import-to-many-loader-in-one-component',
  templateUrl: './dynamic-import-to-many-loader-in-one-component.component.html',
  providers: [setDlcHostComponentProvider(DynamicImportToManyLoaderInOneComponentComponent)],
})
export class DynamicImportToManyLoaderInOneComponentComponent {
  /**
   * Osszes betoltott cmp-ben frissul ez az input
   */
  @DlcInput()
  title = 'title from dynamic';

  @DlcInput(lazyCmp1)
  title2 = 'title2 from dynamic';

  readonly lazyCmp1Id = lazyCmp1;

  readonly lazyCmp2Id = lazyCmp2;

  dynamicModuleLazyRef = () =>
    import('../../dynamic-contents/dynamic-content6/dynamic-content6.module').then((m) => m.DynamicContent6Module);

  dynamicModuleLazyRef2 = () =>
    import('../../dynamic-contents/dynamic-content6/dynamic-content6.module').then((m) => m.DynamicContent6Module);

  constructor() {
    timer(3000, 5000).subscribe((tick) => {
      this.title = `tick: ${tick}`;
      this.title2 = `tick: ${tick}`;
    });
  }
}
