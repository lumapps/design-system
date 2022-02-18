// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
import { KeyboardEventHandler } from '../types';

/**
 * Handle button key pressed (Enter + Space).
 *
 * @param  handler The handler to call.
 * @return The decorated function.
 */
export function onButtonPressed<E extends KeyboardEvent | React.KeyboardEvent>(
    handler: KeyboardEventHandler<E>,
): KeyboardEventHandler<E> {
    return (evt) => {
        if (evt.key !== 'Enter' && evt.key !== ' ') {
            return;
        }
        handler(evt);
    };
}
