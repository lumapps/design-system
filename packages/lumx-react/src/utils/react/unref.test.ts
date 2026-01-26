import { unref } from './unref';

describe('unref', () => {
    it('should return element if it is an instance of HTMLElement', () => {
        const element = document.createElement('div');
        expect(unref(element)).toBe(element);
    });

    it('should return ref.current if it is a ref', () => {
        const element = document.createElement('div');
        const ref = { current: element };
        expect(unref(ref as any)).toBe(element);
    });
});
