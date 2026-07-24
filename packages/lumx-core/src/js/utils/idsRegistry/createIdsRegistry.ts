/**
 * Internal "ids registry" contract shared between framework wrappers (`@lumx/react`, `@lumx/vue`).
 */
export interface IdsRegistry {
    /** Get the id currently registered under `key` (the most recently registered one still holding it), if any. */
    getId(key: string): string | undefined;
    /**
     * Register (or clear, when `id` is `undefined`) the id held by `token` under `key`. `token` identifies the
     * registrant (e.g. one per component instance) so that clearing/overwriting only ever affects its own
     * registration: if it wasn't the most recent registrant, clearing it falls back to whichever other
     * registrant is still holding the key. Notifies its listeners when the id returned by `getId` changes.
     */
    setId(key: string, token: unknown, id: string | undefined): void;
    /** Subscribe to changes of the id registered under `key`. Returns an unsubscribe function. */
    subscribe(key: string, listener: (key: string) => void): () => void;
}

/**
 * Create a standalone ids registry.
 *
 * Can be used to store ids for 'aria-labelledby' or 'aria-describedby'. Registrations under the same key are
 * kept as a stack (most recently registered wins); a registrant clearing itself only affects the top of the
 * stack if it put itself there, so an older still-registered registrant is restored instead of the key going
 * empty.
 */
export function createIdsRegistry(): IdsRegistry {
    const stacks = new Map<string, Array<{ token: unknown; id: string }>>();
    const listeners = new Map<string, Set<(key: string) => void>>();

    const topId = (key: string) => {
        const stack = stacks.get(key);
        return stack?.[stack.length - 1]?.id;
    };

    return {
        getId: topId,

        setId(key, token, id) {
            const previousTopId = topId(key);
            const stack = stacks.get(key) ?? [];
            const index = stack.findIndex((entry) => entry.token === token);
            if (index !== -1) stack.splice(index, 1);
            if (id !== undefined) stack.push({ token, id });

            if (stack.length) {
                stacks.set(key, stack);
            } else {
                stacks.delete(key);
            }

            if (topId(key) === previousTopId) return;
            const set = listeners.get(key);
            if (set) {
                // Copy: a listener may unsubscribe (e.g. on unmount) during this loop.
                const frozenListeners = [...set];

                for (const listener of frozenListeners) {
                    listener(key);
                }
            }
        },

        subscribe(key, listener) {
            let set = listeners.get(key);
            if (!set) {
                set = new Set();
                listeners.set(key, set);
            }
            set.add(listener);
            return () => {
                set.delete(listener);
                if (set.size === 0) listeners.delete(key);
            };
        },
    };
}
