type KeyboardEvent = { key: string };
type KeyboardEventHandler<E extends KeyboardEvent> = (event: E) => void;

/**
 * Make sure the pressed key is the enter key before calling the callback.
 *
 * @param  handler The handler to call on enter/return press.
 * @return The decorated function.
 */
export function onEnterPressed<E extends KeyboardEvent>(handler: KeyboardEventHandler<E>): KeyboardEventHandler<E> {
    return (evt) => {
        if (evt.key !== 'Enter') {
            return;
        }
        handler(evt);
    };
}

/**
 * Make sure the pressed key is the escape key before calling the callback.
 *
 * @param  handler The handler to call on enter/return press.
 * @return The decorated function.
 */
export function onEscapePressed<E extends KeyboardEvent>(handler: KeyboardEventHandler<E>): KeyboardEventHandler<E> {
    return (evt) => {
        if (evt.key !== 'Escape') {
            return;
        }
        handler(evt);
    };
}

/**
 * Handle button key pressed (Enter + Space).
 *
 * @param  handler The handler to call.
 * @return The decorated function.
 */
export function onButtonPressed<E extends KeyboardEvent>(handler: KeyboardEventHandler<E>): KeyboardEventHandler<E> {
    return (evt) => {
        if (evt.key !== 'Enter' && evt.key !== ' ') {
            return;
        }
        handler(evt);
    };
}
