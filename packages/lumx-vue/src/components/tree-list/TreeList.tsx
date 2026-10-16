import { computed, defineComponent, ref } from 'vue';

import {
    TreeList as UI,
    type TreeListProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/TreeList/TreeList';
import { setupTreeList } from '@lumx/core/js/components/TreeList/setupTreeList';
import { isTreeValueSelected, toggleTreeValue } from '@lumx/core/js/components/TreeList/selection';
import type { TreeListHandle } from '@lumx/core/js/components/TreeList/types';
import type { CompositeOptions } from '@lumx/core/js/components/Composite/types';
import type { JSXElement } from '@lumx/core/js/types';

import { useId } from '../../composables/useId';
import { useClassName } from '../../composables/useClassName';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { provideCompositeContext } from '../composite/CompositeContext';
import { useCompositeList } from '../composite/useCompositeList';
import { provideTreeListContext } from './TreeListContext';

/**
 * Props common to the single and multiple selection trees.
 * The ARIA attributes (`aria-label`, `aria-labelledby`) are read from the attributes.
 */
type BaseTreeListProps = VueToJSXProps<
    UIProps,
    'aria-label' | 'aria-labelledby' | 'aria-busy' | 'selectionType' | 'tabIndex'
>;

/** Single selection tree props (`selectionType` defaults to `'single'`). */
export interface SingleTreeListProps extends BaseTreeListProps {
    /** Selection type. Optional: defaults to `'single'`. */
    selectionType?: 'single';
    /** The value of the selected tree item (or `undefined` when nothing is selected). */
    value?: string;
}

/** Multiple selection tree props (`selectionType: 'multiple'` is required to opt in). */
export interface MultipleTreeListProps extends BaseTreeListProps {
    /** Selection type. */
    selectionType: 'multiple';
    /** The values of the selected tree items. */
    value?: string[];
}

/**
 * Props of the TreeList component. Discriminated on `selectionType`: with `'multiple'`, `value` (and the
 * `change` payload) take arrays.
 */
export type TreeListProps = SingleTreeListProps | MultipleTreeListProps;

export const emitSchema = {
    /**
     * On a selection of a selectable tree item (Enter, Space or a click), in a standalone tree only.
     * In a combobox, the trigger `select` event (`Combobox.Input` or `Combobox.Button`) handles the selection.
     */
    select: (option: { value: string }) => !!option,
    /**
     * Selection change, on every selection (in a combobox too). Payload: the selected value, or the toggled
     * values with `selectionType="multiple"`.
     */
    change: (newValue: string | string[]) => newValue !== undefined,
};

/**
 * TreeList component: a list in the WAI-ARIA tree pattern (`role="tree"`), with `TreeListItem` (`TreeList.Item`) items.
 * Use `Combobox.OptionSkeleton` and `Combobox.State` inside, as in a list.
 *
 * Selection: `value` holds the selected tree item value (or values with `selectionType="multiple"`), and
 * the tree items read their selected state from it. `change` is emitted with the new value on every
 * selection (in a combobox too): the selected value, or the toggled values with `selectionType="multiple"`.
 *
 * Adapts to its parent:
 * - Inside a combobox (`Combobox.Provider`): the tree is the combobox list. The trigger owns focus, the
 *   popup opens and closes, and the tree items render only while it is open. The `id` prop is ignored
 *   (the tree takes the combobox list ID, used by the trigger `aria-controls`).
 * - Otherwise, a standalone tree: the tree is its own focus owner (a single tab stop, `aria-activedescendant`
 *   on the tree), handles its own keyboard, and is always open. It has no filter. `select` is emitted on
 *   a selection.
 *
 * The parent is the nearest one: a tree rendered inside a list, an option or a tree item of a combobox
 * (e.g. in a `Combobox.OptionMoreInfo` popover) is standalone. A tree rendered directly under a
 * `Combobox.Provider` is the combobox list, even through a teleport (e.g. in a dialog opened from the
 * combobox): render a standalone tree outside of the `Combobox.Provider`. The mode is set on setup.
 *
 * Keyboard and filter:
 * - Up/Down move over the visible tree items, Right/Left open and close the parent items (or move to
 *   the first sub-item and to the parent item). Enter (or a click) selects a selectable tree item.
 * - With `filter="auto"` on `Combobox.Input`, a tree item matches on its own label and description. The
 *   matching items, their ancestors (opened) and the descendants of a matching parent item stay visible.
 * - With `filter="manual"`, the consumer renders the result: while the input text is not empty, every
 *   parent item with rendered sub-items opens (a matching parent item with no matching sub-item opens
 *   too, unlike `"auto"`). For a tree with lazy parent items, prefer `"manual"` with a search on the server.
 * - Option count (`Combobox.State`): the matching items during an auto filter, every rendered tree item
 *   during a manual filter, and no count without a filter.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 *
 * @param props Component props.
 * @return Vue element.
 */
const TreeList = defineComponent(
    (props: TreeListProps, { slots, attrs, emit }) => {
        const className = useClassName(() => props.class);
        const treeRef = ref<HTMLElement | null>(null);
        const selectionType = computed(() => props.selectionType ?? DEFAULT_PROPS.selectionType);

        /** Compute the next value from the selected tree item, and emit `change`. */
        const handleSelect = (option: { value: string }) => {
            if (props.selectionType === 'multiple') emit('change', toggleTreeValue(props.value, option.value));
            else emit('change', option.value);
        };

        /** Create the tree list handle (with the combobox list options, or as a standalone tree), with the selection. */
        const createList = (options: CompositeOptions) =>
            setupTreeList({
                ...options,
                onSelect(option, element) {
                    options.onSelect?.(option, element);
                    handleSelect(option);
                },
            });

        // The combobox list (linked to the trigger), or a standalone tree that owns focus.
        const {
            handle: tree,
            comboboxListId,
            isOpen,
            isLoading,
        } = useCompositeList<TreeListHandle>({
            elementRef: treeRef,
            createList,
            onSelect: (option) => emit('select', option),
        });
        const generatedId = useId();
        // In a combobox, the trigger controls the tree with the combobox list ID (`aria-controls`).
        const id = computed(() => comboboxListId ?? props.id ?? generatedId);

        provideCompositeContext({
            handle: tree,
            // Getters: keep the provided values reactive (read again on each consumer render).
            get id() {
                return id.value;
            },
            type: 'tree',
            get selectionType() {
                return selectionType.value;
            },
            level: 0,
        });
        // The selection, read by the tree items (the getter reads `value` again on each tree item render).
        provideTreeListContext({ isSelected: (itemValue) => isTreeValueSelected(props.value, itemValue) });

        return () => {
            const { className: _className, ...forwardedAttrs } = attrs;
            return UI({
                ...forwardedAttrs,
                // Standalone: the tree itself is the (single) tab stop.
                tabIndex: tree.value?.isStandalone ? 0 : undefined,
                'aria-busy': isLoading.value,
                className: className.value,
                ref: treeRef,
                id: id.value,
                selectionType: selectionType.value,
                children: isOpen.value ? (slots.default?.() as JSXElement) : null,
            });
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        // Note: the ARIA attributes are not declared as props (Vue would normalize them to camelCase):
        // they are read from the attributes, where Vue keeps the original names.
        props: keysOf<TreeListProps>()('id', 'class', 'selectionType', 'value'),
        emits: emitSchema,
    },
);

export { COMPONENT_NAME, CLASSNAME, DEFAULT_PROPS };
export default TreeList;
