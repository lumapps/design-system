import { getPointerTypeFromEvent } from './getPointerTypeFromEvent';

describe('getPointerTypeFromEvent', () => {
    it('should return "keyboard" if no pointer type is returned by event', () => {
        expect(getPointerTypeFromEvent()).toBe('keyboard');
        expect(getPointerTypeFromEvent({ pointerType: '' } as PointerEvent)).toBe('keyboard');
    });

    it('should return "pointer" if a pointer type is returned by event', () => {
        expect(getPointerTypeFromEvent({ pointerType: 'mouse' } as PointerEvent)).toBe('pointer');
    });
});
