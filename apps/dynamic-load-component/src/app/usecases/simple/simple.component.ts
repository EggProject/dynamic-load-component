import { Component } from '@angular/core';
import { DynamicContentComponent } from '../../dynamic-contents/dynamic-content/dynamic-content.component';

@Component({
  selector: 'dynamic-load-component-simple',
  templateUrl: './simple.component.html',
})
export class SimpleComponent {
  dynamicComponentRef = DynamicContentComponent;
  dynamicComponentRefInputs = { title: 'title', title2: 'title2' };
}
