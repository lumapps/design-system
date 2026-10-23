/** Selection type of a tree list: one selected value, or several. */
export type TreeListSelectionType = 'single' | 'multiple';

/** Whether a tree item value is selected (in the tree value, or equal to it). */
export function isTreeValueSelected(value: string | string[] | undefined, itemValue: string): boolean {
    return Array.isArray(value) ? value.includes(itemValue) : value === itemValue;
}

/**
 * Next value of a multiple selection tree after the user selects a tree item: the item value is removed
 * when it is selected, else added. Pure function: never mutates `value`.
 */
export function toggleTreeValue(value: string[] | undefined, itemValue: string): string[] {
    const values = value ?? [];
    return values.includes(itemValue) ? values.filter((v) => v !== itemValue) : [...values, itemValue];
}
