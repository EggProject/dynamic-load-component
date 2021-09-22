import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DlcDirective } from './dlc.directive';

@NgModule({
  declarations: [DlcDirective],
  imports: [CommonModule],
  exports: [DlcDirective],
})
export class DlcModule {}
