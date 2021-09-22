import { DLC__INPUTS_CONFIGS, DlcInput, DlcInputConfig } from './dlc-input.decorator';

describe('DlcInput decorator', () => {
  it('test property key', () => {
    class Host {
      @DlcInput()
      inputValue!: string;
      @DlcInput()
      inputValueWithDefaultValue = 'default value';
    }

    const host = new Host();
    const configs = Reflect.get(host, DLC__INPUTS_CONFIGS) as DlcInputConfig<unknown>[];
    configs.forEach((config) => expect(config.propertyKey));
    expect(configs[0].propertyKey).toEqual('inputValue');
    expect(configs[1].propertyKey).toEqual('inputValueWithDefaultValue');
  });

  it('test config', () => {
    class Host {
      @DlcInput('cmpId')
      inputValue!: string;
      @DlcInput('cmpId', 'overridedPropertyKey')
      inputValueWithDefaultValue = 'default value';
    }

    const host = new Host();
    const configs = Reflect.get(host, DLC__INPUTS_CONFIGS) as DlcInputConfig<unknown>[];
    configs.forEach((config) => expect(config.propertyKey));
    expect(configs[0].cmpId).toEqual('cmpId');
    expect(configs[0].propertyKey).toEqual('inputValue');
    expect(configs[1].cmpId).toEqual('cmpId');
    expect(configs[1].propertyKey).toEqual('overridedPropertyKey');
    expect(configs[1].originalPropertyKey).toEqual('inputValueWithDefaultValue');
  });

  it('test one change callback', (done) => {
    class Host {
      @DlcInput()
      inputValue!: string;
      @DlcInput()
      inputValueWithDefaultValue = 'default value';
    }

    const testValue = 'test';
    const host = new Host();
    const configs = Reflect.get(host, DLC__INPUTS_CONFIGS) as DlcInputConfig<unknown>[];

    const configsLength = configs.length;
    configs.forEach((config, index) =>
      config.changeCallbacks.push({
        id: '0',
        cb: (newValue: unknown) => {
          expect(newValue).toEqual(testValue);
          if (configsLength - 1 === index) {
            done();
          }
        },
      })
    );

    host.inputValue = testValue;
    host.inputValueWithDefaultValue = testValue;
  });

  it('test to many change callback', (done) => {
    class Host {
      @DlcInput()
      inputValue!: string;
      @DlcInput()
      inputValueWithDefaultValue = 'default value';
    }

    const testValue = 'test';
    const host = new Host();
    const configs = Reflect.get(host, DLC__INPUTS_CONFIGS) as DlcInputConfig<unknown>[];

    const configsLength = configs.length;
    configs.forEach((config, index) => {
      config.changeCallbacks.push({
        id: '0',
        cb: (newValue: unknown) => {
          expect(newValue).toEqual(testValue);
        },
      });
      config.changeCallbacks.push({
        id: '0',
        cb: (newValue: unknown) => {
          expect(newValue).toEqual(testValue);
          if (configsLength - 1 === index) {
            done();
          }
        },
      });
    });

    host.inputValue = testValue;
    host.inputValueWithDefaultValue = testValue;
  });
});
