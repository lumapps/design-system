export const withUndefined = <E>(options: Array<E> | Record<string, E>) => [undefined, ...Object.values(options)];
