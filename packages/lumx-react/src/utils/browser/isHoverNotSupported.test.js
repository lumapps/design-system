import { isHoverNotSupported } from './isHoverNotSupported';

const originalMatchMedia = global.matchMedia;

describe('isHoverNotSupported', () => {
    afterAll(() => {
        global.matchMedia = originalMatchMedia;
    });

    it('should return `false` on browsers that do not support matchMedia', () => {
        global.matchMedia = undefined;
        expect(isHoverNotSupported()).toBe(false);
    });

    it('should return `false` on browsers that support matchMedia and does support hover', () => {
        global.matchMedia = () => ({ matches: false });
        expect(isHoverNotSupported()).toBe(false);
    });

    it('should return `true` on browsers that support matchMedia and does not support hover', () => {
        global.matchMedia = () => ({ matches: true });
        expect(isHoverNotSupported()).toBe(true);
    });
});
