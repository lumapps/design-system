import { getYearDisplayName } from './getYearDisplayName';

describe(getYearDisplayName, () => {
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        vi.spyOn(Intl, 'DisplayNames').mockImplementation(() => ({
            resolvedOptions: () => ({
                fallback: 'code',
                locale: 'fr',
                style: 'short',
                type: 'dateTimeField',
            }),
            of: () => 'année',
        }));
    });
    it('should return a label', () => {
        expect(getYearDisplayName('fr-FR')).toEqual('année');
    });
});
