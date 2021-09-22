import { DLC__OUTPUTS_CONFIGS, DlcOutput, DlcOutputConfig } from './dlc-output.decorator';

const testFn1Name = 'testFn1';
const testFn2Name = 'testFn2';
const outputName = 'outputName';
const cmpId = 'cmpId';

describe('DlcOutput decorator', () => {
  it('test', () => {
    class Host {
      @DlcOutput(outputName)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      [testFn1Name]() {}
      @DlcOutput(outputName, cmpId)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      [testFn2Name]() {}
    }

    const host = new Host();
    const configs = Reflect.get(host, DLC__OUTPUTS_CONFIGS) as DlcOutputConfig[];

    expect(configs[0].methodName).toEqual(testFn1Name);
    expect(configs[0].outputName).toEqual(outputName);
    expect(configs[0].cmpId).toEqual(undefined);
    expect(configs[1].methodName).toEqual(testFn2Name);
    expect(configs[1].outputName).toEqual(outputName);
    expect(configs[1].cmpId).toEqual(cmpId);
  });
});
