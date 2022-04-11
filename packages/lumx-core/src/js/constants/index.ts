/**
 * The prefix to use for the CSS classes.
 */
export const CSS_PREFIX = 'lumx';

/**
 * Key codes.
 */
export * from './keycodes';

/**
 * Animation duration constants. Take into consideration that if you change one of these variables,
 * you need to update their scss counterpart as well
 */
export const DIALOG_TRANSITION_DURATION = 400;
export const NOTIFICATION_TRANSITION_DURATION = 200;
export const SLIDESHOW_TRANSITION_DURATION = 5000;

/**
 * Delay on hover after which we open or close the tooltip.
 * Only applies to devices supporting pointer hover.
 */
export const TOOLTIP_HOVER_DELAY = {
    open: 500,
    close: 0,
};

/**
 * Delay on long press after which we open or close the tooltip.
 * Only applies to devices not supporting pointer hover.
 */
export const TOOLTIP_LONG_PRESS_DELAY = {
    open: 250,
    close: 3000,
};

/**
 * List of elements that receives focus and can be interacted with.
 */
export const INTERACTIVE_ELEMENTS = ['a', 'button', 'select', 'input', 'textarea', '[tabindex="0"]'];
/**
 * List of elements that receives focus and can be interacted, as a string.
 */
export const INTERACTIVE_ELEMENTS_STRING = INTERACTIVE_ELEMENTS.join(',');
