import { Component, EventEmitter, Input, NgModule, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DlcBootstrapComponent } from '../decorator/dlc-bootstrap-component/dlc-bootstrap-component.decorator';

/* eslint-disable */

export const dynamicContentSelector = 'dynamic-content';
export const dynamicContentTextElementId1 = 'test-text1';
export const dynamicContentTextElementId2 = 'test-text2';
export const dynamicContentTextElementId3 = 'test-text3';
export const dynamicContentTextElementId4 = 'test-text4';
@Component({
  selector: dynamicContentSelector,
  template: `<div [attr.id]="id1" (click)="testEvent.emit()">{{ testText }}</div>
    <div [attr.id]="id2">{{ testText2 }}</div>`,
})
export class DynamicContentHostComponent implements OnChanges {
  id1 = dynamicContentTextElementId1;
  id2 = dynamicContentTextElementId2;
  @Input() testText!: string;
  @Input() testText2!: string;
  @Output() testEvent = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {}
}

@NgModule({
  declarations: [DynamicContentHostComponent],
})
export class DynamicContentHostModule {}

@NgModule({
  declarations: [DynamicContentHostComponent],
})
@DlcBootstrapComponent(DynamicContentHostComponent)
export class DynamicContentHostModule2 {}

@NgModule({
  declarations: [DynamicContentHostComponent],
})
export class DynamicContentHostModuleWithoutDlcBootstrapComponentDecorator {}

@Component({
  selector: dynamicContentSelector,
  template: `<div [attr.id]="id3" (click)="testEvent.emit()">{{ testText }}</div>
    <div [attr.id]="id4">{{ testText2 }}</div>`,
})
export class DynamicContent2HostComponent implements OnChanges {
  id3 = dynamicContentTextElementId3;
  id4 = dynamicContentTextElementId4;
  @Input() testText!: string;
  @Input() testText2!: string;
  @Output() testEvent = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {}
}

@NgModule({
  declarations: [DynamicContent2HostComponent],
})
export class DynamicContentHostModule3 {}

@NgModule({
  declarations: [DynamicContent2HostComponent],
})
@DlcBootstrapComponent(DynamicContent2HostComponent)
export class DynamicContentHostModule4 {}
