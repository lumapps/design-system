// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
import { KeyboardEventHandler } from '@lumx/core/js/types';

/**
 * Make sure the pressed key is the escape key before calling the callback.
 *
 * @param  handler The handler to call on enter/return press.
 * @return The decorated function.
 */
export function onEscapePressed<E extends KeyboardEvent | React.KeyboardEvent>(
    handler: KeyboardEventHandler<E>,
): KeyboardEventHandler<E> {
    return (evt) => {
        if (evt.key !== 'Escape') {
            return;
        }
        handler(evt);
    };
}
