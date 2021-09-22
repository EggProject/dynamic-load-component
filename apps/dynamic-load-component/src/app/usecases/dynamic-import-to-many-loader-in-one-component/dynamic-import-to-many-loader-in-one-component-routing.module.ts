import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicImportToManyLoaderInOneComponentComponent } from './dynamic-import-to-many-loader-in-one-component.component';

const routes: Routes = [{ path: '', component: DynamicImportToManyLoaderInOneComponentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DynamicImportToManyLoaderInOneComponentRoutingModule {}
