/** Memoize a function based on the serialization of its args */
export function memoize<A extends Array<unknown>, R>(fn: (...args: A) => R): (...args: A) => R {
    const cache = new Map<string, R>();

    return (...args) => {
        const serializedArgs = JSON.stringify(args);
        if (cache.has(serializedArgs)) return cache.get(serializedArgs) as R;

        const value = fn(...args);
        cache.set(serializedArgs, value);
        return value;
    };
}
