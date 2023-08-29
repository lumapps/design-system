import { Locale } from '@lumx/react/utils/locale/types';

/**
 * Parse locale code
 * @example
 *   parseLocale('EN') // => { code: 'en', language: 'en' }
 *   parseLocale('en_us') // => { code: 'en-US', language: 'en', region: 'US' }
 *   parseLocale('EN-US') // => { code: 'en-US', language: 'en', region: 'US' }
 */
export function parseLocale(locale: string): Locale | undefined {
    const [rawLanguage, rawRegion] = locale.split(/[-_]/);
    if (!rawLanguage) {
        return undefined;
    }
    const language = rawLanguage.toLowerCase();
    let region: string | undefined;
    let code = language;
    if (rawRegion) {
        region = rawRegion.toUpperCase();
        code += `-${region}`;
    }
    return { code, region, language };
}
