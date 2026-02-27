import { block } from '../bem/block';

const PREFIX = 'lumx-action-area';
const ACTION_ELEMENT = `${PREFIX}__action`;

type ActionModifiers = Partial<
    Record<'has-overlay' | 'focus-outset' | 'focus-inset' | 'theme-dark' | 'theme-light', boolean>
>;

/**
 * Action area CSS utility.
 *
 * Apply `actionArea()` to the container element to make it a positioning context
 * for the action's expanded click area.
 *
 * Apply `actionArea.action()` to the primary interactive element (link or button)
 * whose click area should expand to fill the entire container.
 */
export const actionArea = Object.assign(
    /** Action area container class. Sets `position: relative`. */
    () => PREFIX,
    {
        /** Action element class. Adds a `::before` pseudo-element with `position: absolute; inset: 0` to expand the click area. */
        action: (modifiers?: ActionModifiers) => block(ACTION_ELEMENT, modifiers),
    },
);
