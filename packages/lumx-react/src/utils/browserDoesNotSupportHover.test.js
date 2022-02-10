import { browserDoesNotSupportHover } from '@lumx/react/utils/browserDoesNotSupportHover';

const originalMatchMedia = global.matchMedia;

describe('browserDoesNotSupportHover', () => {
    afterAll(() => {
        global.matchMedia = originalMatchMedia;
    });

    it('should return `false` on browsers that do not support matchMedia', () => {
        global.matchMedia = undefined;
        expect(browserDoesNotSupportHover()).toBe(false);
    });

    it('should return `false` on browsers that support matchMedia and does support hover', () => {
        global.matchMedia = () => ({ matches: false });
        expect(browserDoesNotSupportHover()).toBe(false);
    });

    it('should return `true` on browsers that support matchMedia and does not support hover', () => {
        global.matchMedia = () => ({ matches: true });
        expect(browserDoesNotSupportHover()).toBe(true);
    });
});
