import { Theme } from '@lumx/react';
import { invertTheme } from './invertTheme';

describe('invertTheme', () => {
    it('should invert light to dark', () => {
        expect(invertTheme(Theme.light)).toBe(Theme.dark);
    });

    it('should invert dark to light', () => {
        expect(invertTheme(Theme.dark)).toBe(Theme.light);
    });
});
