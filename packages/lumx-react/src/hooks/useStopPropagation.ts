import isFunction from 'lodash/isFunction';
import { MouseEventHandler, useCallback } from 'react';

/**
 * Wrap mouse event handler to stop event propagation.
 *
 * @param  handler   The mouse handler to wrap.
 * @return Mouse handler stopping propagation.
 */
export function useStopPropagation(handler?: MouseEventHandler): MouseEventHandler {
    return useCallback(
        (evt) => {
            if (!evt || !isFunction(handler)) {
                return;
            }
            handler(evt);
            evt.stopPropagation();
        },
        [handler],
    );
}
