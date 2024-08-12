/** Chunk array in slices of given size */
export function chunk<T>(input: Array<T>, size: number): T[][] {
    if (size <= 0) {
        throw new Error('Size must be greater than 0');
    }
    const result: T[][] = [];
    for (let i = 0; i < input.length; i += size) {
        result.push(input.slice(i, i + size));
    }
    return result;
}
