import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicImportComponentComponent } from './dynamic-import-component.component';

const routes: Routes = [{ path: '', component: DynamicImportComponentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DynamicImportComponentRoutingModule {}
