/** Create a pending navigation store; discards intent on abort. */
export function createPendingNavigation(signal: AbortSignal) {
    let pending: (() => boolean) | null = null;
    const clear = () => {
        pending = null;
    };
    signal.addEventListener('abort', clear);
    return {
        get hasPending() {
            return pending !== null;
        },
        defer(navigate: () => boolean) {
            pending = navigate;
        },
        flush() {
            if (pending?.()) pending = null;
        },
        clear,
    };
}
