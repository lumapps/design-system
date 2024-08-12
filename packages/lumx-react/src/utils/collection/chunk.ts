/** Chunk array in slices of given size */
export function chunk<T>(input: Array<T>, size: number): T[][] {
    return input.reduce((arr, item, idx) => {
        return idx % size === 0 ? [...arr, [item]] : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
    }, [] as T[][]);
}
