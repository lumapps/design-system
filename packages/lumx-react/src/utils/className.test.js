import { getBasicClass, handleBasicClasses } from './className';

describe(getBasicClass, () => {
    it('should generate boolean modifier name with boolean prefix', () => {
        expect(getBasicClass({ prefix: 'prefix', type: 'foo', value: true })).toEqual('prefix--is-foo');
    });
    it('should generate boolean modifier name keeping the existing boolean prefix', () => {
        expect(getBasicClass({ prefix: 'prefix', type: 'isFoo', value: true })).toEqual('prefix--is-foo');
        expect(getBasicClass({ prefix: 'prefix', type: 'hasFoo', value: true })).toEqual('prefix--has-foo');
    });
    it(`should generate string modifier name`, () => {
        expect(getBasicClass({ prefix: 'prefix', type: 'foo', value: 'bar' })).toEqual('prefix--foo-bar');
    });
    it(`should generate number modifier name`, () => {
        expect(getBasicClass({ prefix: 'prefix', type: 'foo', value: 2 })).toEqual('prefix--foo-2');
    });
});

describe(handleBasicClasses, () => {
    it('should use prefix if there is no modifier', () => {
        expect(
            handleBasicClasses({
                prefix: 'prefix',
            }),
        ).toEqual('prefix');
    });
    it('should filter falsy modifiers', () => {
        expect(
            handleBasicClasses({
                prefix: 'prefix',
                theme: 'dark',
                isModifier: true,
                isEmpty: '',
                isNull: null,
                isUndefined: undefined,
                isZero: 0,
                isNumberNotZero: 2,
            }),
        ).toEqual('prefix prefix--theme-dark prefix--is-modifier prefix--is-number-not-zero-2');
    });
});
