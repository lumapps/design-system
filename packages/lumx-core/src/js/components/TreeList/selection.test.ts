import { isTreeValueSelected, toggleTreeValue } from './selection';

describe(toggleTreeValue, () => {
    it('should add an unselected value and remove a selected value', () => {
        expect(toggleTreeValue(['lemon'], 'leek')).toEqual(['lemon', 'leek']);
        expect(toggleTreeValue(['lemon', 'leek'], 'lemon')).toEqual(['leek']);
    });

    it('should start from an empty selection without a value', () => {
        expect(toggleTreeValue(undefined, 'lemon')).toEqual(['lemon']);
    });

    it('should never mutate the value', () => {
        const value = Object.freeze(['lemon']) as string[];
        expect(toggleTreeValue(value, 'leek')).not.toBe(value);
        expect(toggleTreeValue(value, 'lemon')).toEqual([]);
        expect(value).toEqual(['lemon']);
    });
});

describe(isTreeValueSelected, () => {
    it('should check a multiple value', () => {
        expect(isTreeValueSelected(['lemon', 'leek'], 'leek')).toBe(true);
        expect(isTreeValueSelected(['lemon'], 'leek')).toBe(false);
    });

    it('should check a single value', () => {
        expect(isTreeValueSelected('lemon', 'lemon')).toBe(true);
        expect(isTreeValueSelected('lemon', 'leek')).toBe(false);
    });

    it('should select nothing without a value', () => {
        expect(isTreeValueSelected(undefined, 'lemon')).toBe(false);
    });
});
