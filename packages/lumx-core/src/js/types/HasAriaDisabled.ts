import { Booleanish } from './Booleanish';

export interface HasAriaDisabled {
    /** Similar to `disabled` but does not block pointer events or focus */
    'aria-disabled'?: Booleanish;
}
