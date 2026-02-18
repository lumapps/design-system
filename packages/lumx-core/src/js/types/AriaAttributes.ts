/**
 * ARIA attributes type for components.
 * All attributes are optional.
 *
 * This is a custom interface containing only the ARIA attributes
 * actually used in the @lumx/core components, avoiding dependency on React types.
 */
export interface AriaAttributes {
    /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
    'aria-expanded'?: boolean | 'true' | 'false';

    /** Indicates the availability and type of interactive popup element that can be triggered by the element. */
    'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

    /** Indicates the current "pressed" state of toggle buttons. */
    'aria-pressed'?: boolean | 'false' | 'mixed' | 'true';

    /** Defines a string value that labels the current element. */
    'aria-label'?: string;

    /** Identifies the element (or elements) that labels the current element. */
    'aria-labelledby'?: string;

    /** Identifies the element (or elements) that describes the object. */
    'aria-describedby'?: string;

    /** Indicates whether the element is exposed to an accessibility API. */
    'aria-hidden'?: boolean | 'true' | 'false';

    /** Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. */
    'aria-disabled'?: boolean | 'true' | 'false';

    /** Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. */
    'aria-checked'?: boolean | 'false' | 'mixed' | 'true';

    /** Indicates whether items in a table or grid are sorted in ascending or descending order. */
    'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
}
