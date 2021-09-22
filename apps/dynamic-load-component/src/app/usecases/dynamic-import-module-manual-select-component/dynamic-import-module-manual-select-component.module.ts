import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicImportModuleManualSelectComponentRoutingModule } from './dynamic-import-module-manual-select-component-routing.module';
import { DynamicImportModuleManualSelectComponentComponent } from './dynamic-import-module-manual-select-component.component';
import { DlcModule } from '@dynamic-load-component/dlc';

@NgModule({
  declarations: [DynamicImportModuleManualSelectComponentComponent],
  imports: [CommonModule, DynamicImportModuleManualSelectComponentRoutingModule, DlcModule],
})
export class DynamicImportModuleManualSelectComponentModule {}
