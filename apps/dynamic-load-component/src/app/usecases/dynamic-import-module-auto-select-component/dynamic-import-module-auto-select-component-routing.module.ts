import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicImportModuleAutoSelectComponentComponent } from './dynamic-import-module-auto-select-component.component';

const routes: Routes = [{ path: '', component: DynamicImportModuleAutoSelectComponentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DynamicImportModuleAutoSelectComponentRoutingModule {}
