import { DLC__BOOTSTRAP_COMPONENT, DlcBootstrapComponent } from './dlc-bootstrap-component.decorator';

describe('DlcBootstrapComponent decorator', () => {
  it('test', () => {
    class FakeComponent {}

    @DlcBootstrapComponent(FakeComponent)
    class Host {}

    const cmpDefRef = Reflect.get(Host, DLC__BOOTSTRAP_COMPONENT);

    expect(cmpDefRef).toEqual(FakeComponent);
  });
});
