import { Locale } from '@lumx/react/utils/locale/types';

/** Get first day of week for locale from the browser API */
export const getFromBrowser = (locale: Locale): number | undefined => {
    try {
        const localeMetadata = new Intl.Locale(locale.code) as any;
        const { firstDay } = localeMetadata.getWeekInfo?.() || localeMetadata.weekInfo;
        // Sunday is represented as `0` in Date.getDay()
        if (firstDay === 7) return 0;
        return firstDay;
    } catch (e) {
        return undefined;
    }
};

/** List first day for each locale (could be removed when all browser implement Locale weekInfo) */
const FIRST_DAY_FOR_LOCALES = [
    {
        // Locales with Sunday as the first day of the week
        localeRX: /^(af|ar-(dz|eg|sa)|bn|cy|en-(ca|us|za)|fr-ca|gd|he|hi|ja|km|ko|pt-br|te|th|ug|zh-hk)$/i,
        firstDay: 0,
    },
    {
        // Locales with Monday as the first day of the week
        localeRX:
            /^(ar-(ma|tn)|az|be|bg|bs|ca|cs|da|de|el|en-(au|gb|ie|in|nz)|eo|es|et|eu|fi|fr|fy|gl|gu|hr|ht|hu|hy|id|is|it|ka|kk|kn|lb|lt|lv|mk|mn|ms|mt|nb|nl|nn|oc|pl|pt|ro|ru|sk|sl|sq|sr|sv|ta|tr|uk|uz|vi|zh-(cn|tw))$/i,
        firstDay: 1,
    },
    {
        // Locales with Saturday as the first day of the week
        localeRX: /^(ar|fa-ir)$/i,
        firstDay: 6,
    },
];

/** Find first day of week for locale from the constant */
const getFromConstant = (locale: Locale, searchBy: keyof Locale = 'code'): number | undefined => {
    // Search for locale (lang + region)
    for (const { localeRX, firstDay } of FIRST_DAY_FOR_LOCALES) {
        if (localeRX.test(locale[searchBy] as string)) return firstDay;
    }
    // Fallback search for locale lang
    if (locale.code !== locale.language) {
        return getFromConstant(locale, 'language');
    }
    return undefined;
};

/**
 * Get first day of the week for the given locale code (language + region).
 */
export const getFirstDayOfWeek = (locale: Locale): number | undefined => {
    // Get from browser API
    const firstDay = getFromBrowser(locale);
    if (firstDay !== undefined) return firstDay;

    // Get from constant
    return getFromConstant(locale);
};
