import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicImportComponentRoutingModule } from './dynamic-import-component-routing.module';
import { DynamicImportComponentComponent } from './dynamic-import-component.component';
import { DlcModule } from '@dynamic-load-component/dlc';

@NgModule({
  declarations: [DynamicImportComponentComponent],
  imports: [CommonModule, DynamicImportComponentRoutingModule, DlcModule],
})
export class DynamicImportComponentModule {}
