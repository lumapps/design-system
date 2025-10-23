import type { AriaAttributes } from 'react';

export interface HasAriaDisabled {
    /** Similar to `disabled` but does not block pointer events or focus */
    'aria-disabled'?: AriaAttributes['aria-disabled'];
}
