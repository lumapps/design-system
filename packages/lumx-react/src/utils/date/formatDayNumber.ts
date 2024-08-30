export function formatDayNumber(locale: string, date: Date): string {
    const formattedDate = date.toLocaleDateString(locale, { day: 'numeric' });
    if (formattedDate.match(/\d/)) return formattedDate.replace(/\D*(\d+)\D*/g, '$1');
    return formattedDate;
}
