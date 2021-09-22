import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicImportModuleAutoSelectComponentRoutingModule } from './dynamic-import-module-auto-select-component-routing.module';
import { DynamicImportModuleAutoSelectComponentComponent } from './dynamic-import-module-auto-select-component.component';
import { DlcModule } from '@dynamic-load-component/dlc';

@NgModule({
  declarations: [DynamicImportModuleAutoSelectComponentComponent],
  imports: [CommonModule, DynamicImportModuleAutoSelectComponentRoutingModule, DlcModule],
})
export class DynamicImportModuleAutoSelectComponentModule {}
