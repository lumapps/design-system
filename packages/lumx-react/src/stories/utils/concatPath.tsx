export type PathPart = string | number;
export type Path = PathPart | Array<PathPart>;

/**
 * Concat flatten object path
 *
 * @example concatPath('foo', 'bar') // => 'foo.bar'
 * @example concatPath(['foo', 0]) // => 'foo[0]'
 * @example concatPath('foo', 0, ['bar']) // => 'foo[0].bar'
 */
export const concatPath = (...prefix: Path[]) => {
    const [first, ...rest] = prefix.flat();
    return rest.reduce<string>((acc, part) => {
        if (typeof part === 'number') return `${acc}[${part}]`;
        return `${acc}.${part}`;
    }, String(first));
};
