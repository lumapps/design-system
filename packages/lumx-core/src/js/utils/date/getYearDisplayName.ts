export const getYearDisplayName = (locale: string) => {
    let label: string | undefined;
    try {
        const displayNames = new Intl.DisplayNames(locale, { type: 'dateTimeField' });
        label = displayNames.of('year');
    } catch (error) {
        label = '';
    }
    return label;
};
