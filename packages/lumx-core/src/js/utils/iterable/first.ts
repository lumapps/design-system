/** Return the first item of an iterable, or `null` if it is empty. */
export function first<T>(iterable: Iterable<T>): T | null {
    const { value, done } = iterable[Symbol.iterator]().next();
    return done ? null : value;
}
