import { DOCUMENT, WINDOW } from '@lumx/react/constants';

export type PositionObserverCallback = (entries: PositionObserverEntry[], observer: PositionObserver) => void;

export type PositionObserverEntry = {
    target: Element;
    boundingClientRect: DOMRect;
    clientHeight: number;
    clientWidth: number;
};

const ERROR_PREFIX = 'PositionObserver Error';

const ROOT = DOCUMENT?.documentElement;

/**
 * Check intersection status and resolve it right away.
 */
function checkIntersections(target: Element) {
    if (!WINDOW?.IntersectionObserver) return null;
    return new Promise<IntersectionObserverEntry>((resolve) => {
        const intersectionObserver = new IntersectionObserver(([entry], ob) => {
            ob.disconnect();
            resolve(entry);
        });
        intersectionObserver.observe(target);
    });
}

/**
 * The PositionObserver class is a utility class that observes the position
 * of DOM elements and triggers a callback when their position changes.
 *
 * Code adapted from https://github.com/thednp/position-observer/blob/ef4a812f8bb1a26f6b605e1ee6c04232f3844aaf/src/index.ts
 */
export class PositionObserver {
    public entries: Map<Element, PositionObserverEntry>;

    _tick: number;

    _callback: PositionObserverCallback;

    /**
     * The constructor takes two arguments, a `callback`, which is called
     * whenever the position of an observed element changes and an `options` object.
     * The callback function should take an array of `PositionObserverEntry` objects
     * as its only argument, but it's not required.
     */
    constructor(callback: PositionObserverCallback) {
        this.entries = new Map();
        this._callback = callback;
        this._tick = 0;
    }

    /**
     * Start observing the position of the specified element.
     * If the element is not currently attached to the DOM,
     * it will NOT be added to the entries.
     */
    public observe = (target: Element) => {
        if (!(target instanceof Element)) {
            throw new Error(`${ERROR_PREFIX}: ${target} is not an instance of Element.`);
        }

        if (!ROOT?.contains(target)) return;

        checkIntersections(target)?.then(({ boundingClientRect }) => {
            if (ROOT && boundingClientRect && !this.entries.has(target)) {
                const { clientWidth, clientHeight } = ROOT;

                this.entries.set(target, {
                    target,
                    boundingClientRect,
                    clientWidth,
                    clientHeight,
                });
            }

            if (!this._tick) this._tick = requestAnimationFrame(this._runCallback);
        });
    };

    /**
     * Private method responsible for all the heavy duty, the observer's runtime.
     */
    private _runCallback = () => {
        if (!ROOT || !this.entries.size) return;
        const { clientWidth, clientHeight } = ROOT;

        const queue: Array<Promise<PositionObserverEntry | undefined>> = [];
        for (const {
            target,
            boundingClientRect: oldBoundingBox,
            clientWidth: oldWidth,
            clientHeight: oldHeight,
        } of this.entries.values()) {
            if (!ROOT.contains(target)) continue;

            const update = checkIntersections(target)?.then(({ boundingClientRect, isIntersecting }) => {
                if (!isIntersecting) return undefined;
                const { left, top } = boundingClientRect;

                if (
                    oldBoundingBox.top !== top ||
                    oldBoundingBox.left !== left ||
                    oldWidth !== clientWidth ||
                    oldHeight !== clientHeight
                ) {
                    const newEntry: PositionObserverEntry = {
                        target,
                        boundingClientRect,
                        clientHeight,
                        clientWidth,
                    };
                    this.entries.set(target, newEntry);
                    return newEntry;
                }
            });
            if (update) queue.push(update);
        }

        this._tick = requestAnimationFrame(async () => {
            // execute the queue
            const updates = (await Promise.all(queue)).filter(Boolean) as PositionObserverEntry[];

            // only execute the callback if position actually changed
            if (updates.length) this._callback(updates, this);

            this._runCallback();
        });
    };

    /**
     * Immediately stop observing all elements.
     */
    public disconnect = () => {
        cancelAnimationFrame(this._tick);
        this.entries.clear();
        this._tick = 0;
    };
}
