/**
 * Get the correct pointer type from the given event.
 * This is used when a tab stop is selected, to check if is has been selected using a keyboard or a pointer
 * (pen / mouse / touch)
 */
export function getPointerTypeFromEvent(event?: PointerEvent | Event) {
    return event && 'pointerType' in event && Boolean(event.pointerType) ? 'pointer' : 'keyboard';
}
