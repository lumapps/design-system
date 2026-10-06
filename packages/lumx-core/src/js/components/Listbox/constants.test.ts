import { isOptionActiveEvent, optionActiveEvent } from './constants';

describe('optionActiveEvent', () => {
    it('should build the event name from the option id', () => {
        expect(optionActiveEvent('apple')).toBe('optionActive:apple');
    });
});

describe('isOptionActiveEvent', () => {
    it('should return true for an option active event', () => {
        expect(isOptionActiveEvent(optionActiveEvent('apple'))).toBe(true);
    });

    it('should return false for a static combobox event', () => {
        expect(isOptionActiveEvent('activeDescendantChange')).toBe(false);
        expect(isOptionActiveEvent('open')).toBe(false);
    });
});
