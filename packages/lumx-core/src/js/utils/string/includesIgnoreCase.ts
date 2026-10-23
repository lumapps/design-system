/** Whether a text contains a search text, with no regard to the letter case (an empty search text always matches). */
export function includesIgnoreCase(text: string, search: string): boolean {
    return text.toLowerCase().includes(search.toLowerCase());
}
