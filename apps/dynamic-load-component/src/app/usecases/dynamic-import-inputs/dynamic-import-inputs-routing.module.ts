import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicImportInputsComponent } from './dynamic-import-inputs.component';

const routes: Routes = [{ path: '', component: DynamicImportInputsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DynamicImportInputsRoutingModule {}
