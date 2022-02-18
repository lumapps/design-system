import { DOCUMENT } from '@lumx/react/constants';
import { Callback, onEscapePressed } from '@lumx/react/utils';
import { useEffect } from 'react';

/**
 * Triggers a callback when the escape key is pressed.
 *
 * @param callback      Callback
 * @param closeOnEscape Disables the hook when false
 * @param rootElement   Element on which to listen the escape key
 */
export function useCallbackOnEscape(
    callback: Callback | undefined,
    closeOnEscape = true,
    rootElement = DOCUMENT?.body,
) {
    useEffect(() => {
        if (closeOnEscape && callback && rootElement) {
            const onKeyDown = onEscapePressed(callback);
            rootElement.addEventListener('keydown', onKeyDown);
            return () => rootElement.removeEventListener('keydown', onKeyDown);
        }
        return undefined;
    }, [callback, closeOnEscape, rootElement]);
}
