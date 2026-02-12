export interface HasChecked<C = boolean> {
    /** Component checked state. */
    isChecked?: C;
    /** @alias isChecked */
    checked?: boolean;
}
