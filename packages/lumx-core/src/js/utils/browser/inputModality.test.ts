// @vitest-environment jsdom
import { fireEvent } from '@testing-library/dom';
import { getInputModality } from './inputModality';

describe('getInputModality', () => {
    it('should return keyboard after a key press', () => {
        fireEvent.keyDown(document.body, { key: 'Enter' });
        expect(getInputModality()).toBe('keyboard');
    });

    it('should return pointer after a pointer down', () => {
        fireEvent.pointerDown(document.body);
        expect(getInputModality()).toBe('pointer');
    });

    it('should return pointer after a mouse down', () => {
        fireEvent.keyDown(document.body, { key: 'Enter' });
        fireEvent.mouseDown(document.body);
        expect(getInputModality()).toBe('pointer');
    });

    it('should return pointer after a touch start', () => {
        fireEvent.keyDown(document.body, { key: 'Enter' });
        fireEvent.touchStart(document.body);
        expect(getInputModality()).toBe('pointer');
    });
});
