import { memoize } from '@lumx/react/utils/function/memoize';

describe(memoize, () => {
    it('should memoize a function returning nothing', () => {
        const fn = jest.fn();
        const memoized = memoize(fn);

        expect(memoized()).toEqual(undefined);
        expect(memoized()).toEqual(undefined);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should memoize a function with no args', () => {
        const fn = jest.fn((i) => i);
        const memoized = memoize(fn);

        expect(memoized('value')).toEqual('value');
        expect(memoized('value')).toEqual('value');
        expect(fn).toHaveBeenCalledTimes(1);

        expect(memoized('another value')).toEqual('another value');
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should memoize a function with multiple args', () => {
        const fn = jest.fn((a, b) => `${a} ${b}`);
        const memoized = memoize(fn);

        expect(memoized(1, true)).toEqual('1 true');
        expect(memoized(1, true)).toEqual('1 true');
        expect(fn).toHaveBeenCalledTimes(1);

        expect(memoized('foo', 4)).toEqual('foo 4');
        expect(fn).toHaveBeenCalledTimes(2);
    });
});
