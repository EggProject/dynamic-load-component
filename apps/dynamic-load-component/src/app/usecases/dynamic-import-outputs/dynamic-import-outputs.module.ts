import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicImportOutputsRoutingModule } from './dynamic-import-outputs-routing.module';
import { DynamicImportOutputsComponent } from './dynamic-import-outputs.component';
import { DlcModule } from '@dynamic-load-component/dlc';

@NgModule({
  declarations: [DynamicImportOutputsComponent],
  imports: [CommonModule, DynamicImportOutputsRoutingModule, DlcModule],
})
export class DynamicImportOutputsModule {}
