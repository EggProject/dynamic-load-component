import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'dynamic-load-component-dynamic-content',
  templateUrl: './dynamic-content.component.html',
  // TODO mukodik?
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicContentComponent implements OnInit, OnChanges, OnDestroy {
  @Input() title!: string;
  @Input() title2!: string;
  @Input('asdasd') title3!: string;
  @Output() testOutput = new EventEmitter<number>();

  constructor(private cdr: ChangeDetectorRef) {
    timer(5000, 10000).subscribe(() => this.testOutput.emit(new Date().getTime()));
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('DynamicContentComponent::ngOnChanges', changes);
    // OnPush mod eseten kell: this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    console.log('DynamicContentComponent::ngOnDestroy');
  }

  ngOnInit(): void {
    console.log('DynamicContentComponent::ngOnInit');
  }
}
