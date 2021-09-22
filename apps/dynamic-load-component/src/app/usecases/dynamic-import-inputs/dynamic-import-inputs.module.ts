import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicImportInputsRoutingModule } from './dynamic-import-inputs-routing.module';
import { DynamicImportInputsComponent } from './dynamic-import-inputs.component';
import { DlcModule } from '@dynamic-load-component/dlc';

@NgModule({
  declarations: [DynamicImportInputsComponent],
  imports: [CommonModule, DynamicImportInputsRoutingModule, DlcModule],
})
export class DynamicImportInputsModule {}
