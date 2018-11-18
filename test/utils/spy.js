export default async function spy({
    fn,
    expectValue,
}) {
    const log = console.log;
    const spy = jest.fn();
    console.log = spy;
    try {
        await fn();
        expect(spy.mock.calls).toEqual(expectValue);
    } finally {
        spy.mockClear();
        console.log = log;
    }
}