import { LONG_DATE_FORMAT } from './formatDate';
import { getCalendarDate, getDaysInMonth } from './calendarDay';

type DateField = 'day' | 'month' | 'year';

/** Date format data of a locale, read from `Intl.DateTimeFormat#formatToParts`. */
interface LocaleDateFormat {
    /** Field order of the numeric format (ex: `fr-FR` day/month/year, `en-US` month/day/year). */
    numericOrder: DateField[];
    /** Order of the day and year in the long format. */
    longOrder: DateField[];
    /** Month names (normalized) with their month index, longest first. */
    monthNames: Array<{ name: string; monthIndex: number }>;
    /** Locale digits to ASCII digits. */
    digits: Map<string, string>;
}

/** Bidirectional marks (ex: in the `ar` formats). */
const BIDI_MARKS = /[‎‏؜‪-‮⁦-⁩]/g;

const DATE_FIELDS: string[] = ['day', 'month', 'year'];

const localeFormats = new Map<string, LocaleDateFormat>();

/** Replace the locale digits by ASCII digits. */
const toAsciiDigits = (text: string, digits: Map<string, string>) =>
    Array.from(text, (char) => digits.get(char) ?? char).join('');

/** Normalize a text before matching month names (lower case, ASCII digits, no dots). */
const normalize = (text: string, locale: string, digits: Map<string, string>) =>
    toAsciiDigits(text.normalize('NFC').replace(BIDI_MARKS, ''), digits)
        .toLocaleLowerCase(locale)
        .replace(/\./g, ' ')
        .trim();

function getLocaleDateFormat(locale: string): LocaleDateFormat {
    const cached = localeFormats.get(locale);
    if (cached) return cached;

    const sample = new Date(2001, 10, 23);
    const getOrder = (options: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat(locale, options)
            .formatToParts(sample)
            .map(({ type }) => type)
            .filter((type): type is DateField => DATE_FIELDS.includes(type));

    const numberFormat = new Intl.NumberFormat(locale, { useGrouping: false });
    const digits = new Map<string, string>();
    for (let digit = 0; digit <= 9; digit += 1) {
        digits.set(numberFormat.format(digit), String(digit));
    }

    // Month names: long format (as displayed in the field), short format and stand-alone month name.
    const monthFormats = [LONG_DATE_FORMAT, { year: 'numeric', month: 'short', day: 'numeric' }, { month: 'long' }].map(
        (options) => new Intl.DateTimeFormat(locale, options as Intl.DateTimeFormatOptions),
    );
    const monthNames: LocaleDateFormat['monthNames'] = [];
    for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
        const date = new Date(2001, monthIndex, 15);
        for (const format of monthFormats) {
            const value = format.formatToParts(date).find(({ type }) => type === 'month')?.value;
            const name = value && normalize(value, locale, digits);
            // Skip numeric months (ex: `ja` short format) and duplicates.
            if (name && !/^\d+$/.test(name) && !monthNames.some((entry) => entry.name === name)) {
                monthNames.push({ name, monthIndex });
            }
        }
    }
    monthNames.sort((a, b) => b.name.length - a.name.length);

    const format: LocaleDateFormat = {
        numericOrder: getOrder({ year: 'numeric', month: 'numeric', day: 'numeric' }),
        longOrder: getOrder(LONG_DATE_FORMAT).filter((field) => field !== 'month'),
        monthNames,
        digits,
    };
    localeFormats.set(locale, format);
    return format;
}

/** Year of a typed year token: a two-digit year goes to the year nearest to today (50 years back, 49 forward). */
function getYear(token: string, today: Date): number {
    const value = Number(token);
    if (token.length > 2) return value;
    const windowStart = today.getFullYear() - 50;
    return windowStart + ((((value - windowStart) % 100) + 100) % 100);
}

export interface ParseDateOptions {
    /** Reference date for the current year and the two-digit year window. Default: now. */
    today?: Date;
}

/**
 * Parse a date typed in a date field, in the formats of the locale:
 *
 * 1. The long format with the locale month names (ex: `November 12, 2026`, `12 novembre 2026`, `12 nov. 2026`).
 * 2. A numeric date in the field order of the locale (`fr-FR` day/month/year, `en-US` month/day/year). Any
 *    non-digit characters separate the fields (ex: `12/11/2026`, `12.11.26`, `12 11 2026`).
 * 3. A two-digit year: the year nearest to today, 50 years back to 49 years forward (`85` → 1985, `26` → 2026).
 * 4. A day and a month with no year: the current year.
 *
 * A single number, an impossible date (ex: `31/02/2026`) or any other text is not valid (`undefined`).
 *
 * @return The calendar date of the day (`00:00 UTC` instant whose local date is the day, same time of day as a day
 *         pick, see `getCalendarDate`), or `undefined` when the text is not a valid date.
 */
export function parseDate(
    text: string,
    locale: string,
    { today = new Date() }: ParseDateOptions = {},
): Date | undefined {
    const format = getLocaleDateFormat(locale);
    let normalized = normalize(text, locale, format.digits);
    if (!normalized) return undefined;

    let order: DateField[];
    let monthIndex: number | undefined;
    const monthName = format.monthNames.find(({ name }) => normalized.includes(name));
    if (monthName) {
        // Long format: the month name, then the day and the year in the long format order.
        monthIndex = monthName.monthIndex;
        normalized = normalized.replace(monthName.name, ' ');
        order = format.longOrder;
    } else {
        order = format.numericOrder;
    }

    const tokens = normalized.match(/\d+/g) || [];
    // Without a year
    if (tokens.length === order.length - 1) order = order.filter((field) => field !== 'year');
    if (tokens.length !== order.length) return undefined;

    const fields: Partial<Record<DateField, string>> = {};
    order.forEach((field, index) => {
        fields[field] = tokens[index];
    });

    const year = fields.year === undefined ? today.getFullYear() : getYear(fields.year, today);
    const month = monthIndex ?? Number(fields.month) - 1;
    const day = Number(fields.day);
    if (!(month >= 0 && month <= 11) || year < 1 || day < 1 || day > getDaysInMonth(year, month)) return undefined;
    return getCalendarDate(year, month, day);
}
