import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicImportToManyLoaderInOneComponentRoutingModule } from './dynamic-import-to-many-loader-in-one-component-routing.module';
import { DynamicImportToManyLoaderInOneComponentComponent } from './dynamic-import-to-many-loader-in-one-component.component';
import { DlcModule } from '@dynamic-load-component/dlc';

@NgModule({
  declarations: [DynamicImportToManyLoaderInOneComponentComponent],
  imports: [CommonModule, DynamicImportToManyLoaderInOneComponentRoutingModule, DlcModule],
})
export class DynamicImportToManyLoaderInOneComponentModule {}
