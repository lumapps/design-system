/**
 * Unescape HTML in string.
 * We have to use this function because Storybook automatically escape our strings with 'text' or 'object' knobs.
 *
 * @param  input String to decode.
 * @return Decoded string.
 */
export function htmlDecode(input: string): string {
    const e = document.createElement('textarea');
    e.innerHTML = input;
    // handle case of empty input
    return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue!;
}
