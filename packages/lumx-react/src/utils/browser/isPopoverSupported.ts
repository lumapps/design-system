import { WINDOW } from '@lumx/react/constants';

/** Check if browser supports the HTML Popover API */
export function isPopoverSupported() {
    return WINDOW != null && 'popover' in HTMLElement.prototype;
}
