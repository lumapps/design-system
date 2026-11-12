/** `Intl.DisplayNames` with the `dateTimeField` type (ES2022, not in the TS lib of the repo). */
type DateTimeFieldDisplayNames = new (
    locale: string,
    options: { type: 'dateTimeField' },
) => { of(code: string): string | undefined };

export const getYearDisplayName = (locale: string) => {
    let label: string | undefined;
    try {
        const DisplayNames = Intl.DisplayNames as unknown as DateTimeFieldDisplayNames;
        const displayNames = new DisplayNames(locale, { type: 'dateTimeField' });
        label = displayNames.of('year');
    } catch (error) {
        label = '';
    }
    return label;
};
