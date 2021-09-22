import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicImportOutputsComponent } from './dynamic-import-outputs.component';

const routes: Routes = [{ path: '', component: DynamicImportOutputsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DynamicImportOutputsRoutingModule {}
