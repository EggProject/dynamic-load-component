import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicContent5Component } from './dynamic-content5.component';
import { DlcBootstrapComponent } from '@dynamic-load-component/dlc';

@NgModule({
  declarations: [DynamicContent5Component],
  imports: [CommonModule],
  exports: [DynamicContent5Component],
})
@DlcBootstrapComponent(DynamicContent5Component)
export class DynamicContent5Module {}
