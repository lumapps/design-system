export const getYearDisplayName = (locale: string) => {
    let label: string | undefined;
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const displayNames = new Intl.DisplayNames(locale, { type: 'dateTimeField' });
        label = displayNames.of('year');
    } catch (error) {
        label = '';
    }
    return label;
};
