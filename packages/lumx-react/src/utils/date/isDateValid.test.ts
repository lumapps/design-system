import { isDateValid } from '@lumx/react/utils/date/isDateValid';

describe(isDateValid.name, () => {
    it('should mark `undefined` as invalid', () => {
        expect(isDateValid(undefined)).toBe(false);
    });

    it('should mark invalid date as invalid', () => {
        expect(isDateValid(new Date('foo'))).toBe(false);
    });

    it('should mark valid date as valid', () => {
        expect(isDateValid(new Date())).toBe(true);
    });
});
