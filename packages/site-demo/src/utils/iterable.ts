/** Filter an iterable by a predicate */
export function* filter<I>(iterable: Iterable<I>, predicate: (i: I) => boolean) {
    const it = iterable[Symbol.iterator]();
    let current = it.next();
    while (!current.done) {
        const item = current.value;
        if (predicate(item)) {
            yield item;
        }
        current = it.next();
    }
}

/** Take n elements from an iterable */
export function* take<I>(iterable: Iterable<I>, n: number) {
    let i = n;
    const it = iterable[Symbol.iterator]();
    let current = it.next();
    while (!current.done) {
        if (!i) return;
        i -= 1;
        yield current.value;
        current = it.next();
    }
}

/** Wrap an iterable so that it can be called multiple time and that it's result cached */
export function cached<I>(it: Iterable<I>) {
    const iterator = it[Symbol.iterator]();
    const buffer: Array<I> = [];
    let allDone = false;

    return function* () {
        let index = 0;
        while (!allDone || index < buffer.length) {
            if (index < buffer.length) {
                yield buffer[index];
            } else {
                if (allDone) {
                    return;
                }
                const { value, done } = iterator.next();
                if (done) {
                    allDone = true;
                    return;
                }
                buffer.push(value);
                yield value;
            }
            index += 1;
        }
    };
}
