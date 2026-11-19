import { getYearDisplayName } from './getYearDisplayName';

describe(getYearDisplayName, () => {
    it('should return a label', () => {
        vi.stubGlobal('Intl', {
            DisplayNames: class {
                // eslint-disable-next-line class-methods-use-this
                of() {
                    return 'année';
                }
            },
        });
        expect(getYearDisplayName('fr-FR')).toEqual('année');
    });
});
