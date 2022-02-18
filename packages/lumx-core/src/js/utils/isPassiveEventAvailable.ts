import noop from 'lodash/noop';

/**
 * Checks whether or not the browser support passive events.
 * @see https://github.com/Modernizr/Modernizr/blob/6d56d814b9682843313b16060adb25a58d83a317/feature-detects/dom/passiveeventlisteners.js
 */
export function isPassiveEventAvailable() {
    let supportsPassiveOption = false;
    try {
        const opts = Object.defineProperty({}, 'passive', {
            get() {
                supportsPassiveOption = true;
            },
        });
        window.addEventListener('testPassiveEventSupport', noop, opts);
        window.removeEventListener('testPassiveEventSupport', noop, opts);
    } catch (e) {
        // ignored
    }
    return supportsPassiveOption;
}
