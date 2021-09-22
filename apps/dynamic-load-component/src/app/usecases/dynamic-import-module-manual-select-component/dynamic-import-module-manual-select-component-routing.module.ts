import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicImportModuleManualSelectComponentComponent } from './dynamic-import-module-manual-select-component.component';

const routes: Routes = [{ path: '', component: DynamicImportModuleManualSelectComponentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DynamicImportModuleManualSelectComponentRoutingModule {}
