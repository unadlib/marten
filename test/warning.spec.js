import warning from '../src/warning';

describe('warning', () => {
    it('calls console.warn when invalid', () => {
        const preSpy = console.warn;
        const spy = jest.fn();
        console.warn = spy;
        try {
            const operate = 'Test';
            warning.invalid(operate);
            expect(spy.mock.calls[0][0]).toBe(`Execution '${operate}' mode invalid.`);
        } finally {
            spy.mockClear();
            console.warn = preSpy;
        }
    });
    it('calls console.warn when deprecated', () => {
        const preSpy = console.warn;
        const spy = jest.fn();
        console.warn = spy;
        try {
            warning.deprecated();
            expect(spy.mock.calls[0][0]).toBe('The \'@step\' decorator on this function can be removed , which currently it supports only async generator function.');
        } finally {
            spy.mockClear();
            console.warn = preSpy;
        }
    });
    it('throw new Error when setSteps', () => {
        expect(()=>{
            warning.setSteps();
        }).toThrowError('Getter \'steps\' should be implemented as array.');
    });
    it('throw new Error when skipStep', () => {
        expect(()=>{
            warning.skipStep();
        }).toThrowError('Set skip step error.');
    });
    it('throw new Error when execOperation', () => {
        const operate = 'Test';
        expect(()=>{
            warning.execOperation(operate);
        }).toThrowError(`Execution '${operate}' mode error.`);
    });
    it('throw new Error when execStep', () => {
        expect(()=>{
            warning.execStep();
        }).toThrowError('Step function was not exist.');
    });
    it('throw new Error when execStep', () => {
        expect(()=>{
            warning.repeatedSteps();
        }).toThrowError('Getter steps exists at least one repeat step.');
    });
});