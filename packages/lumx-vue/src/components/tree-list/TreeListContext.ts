import { type InjectionKey, inject, provide } from 'vue';

/** Context value provided by `TreeList` to its tree items: the selection. */
export interface TreeListContextValue {
    /** Whether a tree item value is selected (in the tree `value`). */
    isSelected(value: string): boolean;
}

const TREE_LIST_CONTEXT_KEY: InjectionKey<TreeListContextValue> = Symbol('tree-list-context');

/** Provide the tree list context (see `TreeList`). */
export function provideTreeListContext(value: TreeListContextValue) {
    provide(TREE_LIST_CONTEXT_KEY, value);
}

/** Access the tree list context, or `undefined` outside of a `TreeList` (does not throw). */
export function useOptionalTreeListContext(): TreeListContextValue | undefined {
    return inject(TREE_LIST_CONTEXT_KEY, undefined);
}
