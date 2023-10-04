import { parseLocale } from '@lumx/react/utils/locale/parseLocale';

describe(parseLocale.name, () => {
    it('should parse various locale formats', () => {
        expect(parseLocale('en')).toEqual({ code: 'en', language: 'en' });
        expect(parseLocale('EN')).toEqual({ code: 'en', language: 'en' });
        expect(parseLocale('en-US')).toEqual({ code: 'en-US', language: 'en', region: 'US' });
        expect(parseLocale('en-us')).toEqual({ code: 'en-US', language: 'en', region: 'US' });
        expect(parseLocale('en_us')).toEqual({ code: 'en-US', language: 'en', region: 'US' });
        expect(parseLocale('EN-US')).toEqual({ code: 'en-US', language: 'en', region: 'US' });
    });

    it('should fail on invalid locale', () => {
        expect(parseLocale('-')).toBe(undefined);
        expect(parseLocale('-foo')).toBe(undefined);
    });
});
