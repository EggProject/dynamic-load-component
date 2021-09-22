import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimpleRoutingModule } from './simple-routing.module';
import { SimpleComponent } from './simple.component';
import { DlcModule } from '@dynamic-load-component/dlc';

@NgModule({
  declarations: [SimpleComponent],
  imports: [CommonModule, SimpleRoutingModule, DlcModule],
})
export class SimpleModule {}
