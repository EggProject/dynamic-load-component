import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicContent3Component } from './dynamic-content3.component';
import { DlcBootstrapComponent } from '@dynamic-load-component/dlc';

@NgModule({
  declarations: [DynamicContent3Component],
  imports: [CommonModule],
  exports: [DynamicContent3Component],
})
@DlcBootstrapComponent(DynamicContent3Component)
export class DynamicContent3Module {}
