import { formatDayNumber } from '@lumx/react/utils/date/formatDayNumber';

describe(formatDayNumber, () => {
    it('should format ', () => {
        // Standard numerical formatting.
        expect(formatDayNumber('en', new Date('2024-05-11'))).toEqual('11');
        // Keep only the numerical part (if any). Raw formatted day number here is '11日'.
        expect(formatDayNumber('ja', new Date('2024-05-11'))).toEqual('11');
        // Else Keep the non-numerical formatting
        expect(formatDayNumber('ar-eg', new Date('2024-05-11'))).toEqual('١١');
    });
});
