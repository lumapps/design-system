import { addMonthResetDay } from '@lumx/react/utils/date/addMonthResetDay';

describe(addMonthResetDay.name, () => {
    it('should add month to date', () => {
        const actual = addMonthResetDay(new Date('2017-01-30'), 1);
        expect(actual).toEqual(new Date('2017-02-01'));
    });

    it('should remove months to date', () => {
        const actual = addMonthResetDay(new Date('2017-01-30'), -2);
        expect(actual).toEqual(new Date('2016-11-01'));
    });
});
