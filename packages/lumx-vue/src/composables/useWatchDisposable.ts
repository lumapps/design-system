import { type WatchOptions, type WatchSource, onUnmounted, watch } from 'vue';

type Cleanup = void | (() => void);

type MapSources<T> = {
    [K in keyof T]: T[K] extends WatchSource<infer V> ? V : never;
};

type MultiWatchSources = (WatchSource<unknown> | object)[];

/**
 * Watch a reactive source and run an effect that can return a cleanup function.
 * On each re-run the previous cleanup is called automatically.
 * Stops and cleans up on unmount.
 *
 * @param source  One or more reactive sources to watch.
 * @param effect  Effect callback receiving the new (and old) value; may return a cleanup function.
 * @param options Watch options (defaults to `{ immediate: true }`).
 * @returns A stop function that also runs the latest cleanup.
 */
export function useWatchDisposable<T extends MultiWatchSources>(
    source: [...T],
    effect: (value: MapSources<T>, oldValue: MapSources<T> | undefined) => Cleanup,
    options?: WatchOptions,
): () => void;
export function useWatchDisposable<T>(
    source: WatchSource<T>,
    effect: (value: T, oldValue: T | undefined) => Cleanup,
    options?: WatchOptions,
): () => void;
export function useWatchDisposable(
    source: any,
    effect: (value: any, oldValue: any) => Cleanup,
    options: WatchOptions = { immediate: true },
) {
    let cleanup: (() => void) | undefined;

    const runCleanup = () => {
        cleanup?.();
        cleanup = undefined;
    };

    const stop = watch(
        source,
        (value: any, oldValue: any) => {
            runCleanup();
            const maybeCleanup = effect(value, oldValue);
            if (typeof maybeCleanup === 'function') {
                cleanup = maybeCleanup;
            }
        },
        options,
    );

    onUnmounted(() => {
        stop();
        runCleanup();
    });

    return () => {
        stop();
        runCleanup();
    };
}
