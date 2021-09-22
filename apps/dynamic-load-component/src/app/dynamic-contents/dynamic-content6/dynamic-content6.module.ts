import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicContent6Component } from './dynamic-content6.component';
import { DlcBootstrapComponent } from '@dynamic-load-component/dlc';

@NgModule({
  declarations: [DynamicContent6Component],
  imports: [CommonModule],
  exports: [DynamicContent6Component],
})
@DlcBootstrapComponent(DynamicContent6Component)
export class DynamicContent6Module {}
