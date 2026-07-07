/**
 * Wrap `fn` so that, no matter how many times the returned function is called within the same
 * microtask cycle, `fn` only runs once at the end of that cycle.
 */
export function debounceMicrotask(fn: () => void) {
    let running = false;
    const debounced = () => {
        if (!running) {
            running = true;
            queueMicrotask(() => {
                if (running) {
                    running = false;
                    fn();
                }
            });
        }
    };
    debounced.cancel = () => {
        running = false;
    };
    return debounced;
}
