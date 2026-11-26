// @vitest-environment jsdom
import { visuallyHidden } from '../classNames/visually-hidden';
import { getOverflowingText } from './getOverflowingText';

describe('getOverflowingText', () => {
    it('should return undefined without an element', () => {
        expect(getOverflowingText(null)).toBeUndefined();
        expect(getOverflowingText(undefined)).toBeUndefined();
    });

    it('should return the text when it overflows', () => {
        const element = document.createElement('div');
        Object.defineProperties(element, {
            innerText: { value: 'Long text' },
            offsetWidth: { value: 50 },
            scrollWidth: { value: 100 },
        });

        expect(getOverflowingText(element)).toBe('Long text');
    });

    it('should return undefined when the text fits', () => {
        const element = document.createElement('div');
        Object.defineProperties(element, {
            innerText: { value: 'Short' },
            offsetWidth: { value: 100 },
            scrollWidth: { value: 100 },
        });

        expect(getOverflowingText(element)).toBeUndefined();
    });

    it('should return undefined when the element is hidden (width 0)', () => {
        const element = document.createElement('div');
        Object.defineProperties(element, {
            innerText: { value: 'Long text' },
            offsetWidth: { value: 0 },
            scrollWidth: { value: 100 },
        });

        expect(getOverflowingText(element)).toBeUndefined();
    });

    it('should return undefined inside a visually hidden block', () => {
        const parent = document.createElement('div');
        parent.className = visuallyHidden();
        const element = document.createElement('div');
        parent.append(element);
        Object.defineProperties(element, {
            innerText: { value: 'Long text' },
            offsetWidth: { value: 1 },
            scrollWidth: { value: 100 },
        });

        expect(getOverflowingText(element)).toBeUndefined();
    });
});
