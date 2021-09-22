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
  selector: 'dynamic-load-component-dynamic-content2',
  templateUrl: './dynamic-content5.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicContent5Component implements OnInit, OnChanges, OnDestroy {
  @Input() title!: string;
  @Input() title2!: string;
  @Input() title3!: string;
  @Input() title4!: string;
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
