import { createContext } from 'react';

/** Context value provided by `TreeList` to its tree items: the selection. */
export interface TreeListContextValue {
    /** Whether a tree item value is selected (in the tree `value`). */
    isSelected(value: string): boolean;
}

export const TreeListContext = createContext<TreeListContextValue | undefined>(undefined);
