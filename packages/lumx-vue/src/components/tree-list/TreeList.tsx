import { computed, defineComponent, onBeforeUnmount, ref, shallowRef } from 'vue';

import {
    TreeList as UI,
    type TreeListProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/TreeList/TreeList';
import { setupTreeList } from '@lumx/core/js/components/TreeList/setupTreeList';
import type { TreeListHandle } from '@lumx/core/js/components/TreeList/types';
import type { JSXElement } from '@lumx/core/js/types';

import { useId } from '../../composables/useId';
import { useClassName } from '../../composables/useClassName';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { provideCompositeContext, useOptionalCompositeContext } from '../composite/CompositeContext';
import { useCompositeList } from '../composite/useCompositeList';
import { useOptionalComboboxContext } from '../combobox/context/ComboboxContext';

/**
 * Props of the TreeList component.
 * The ARIA attributes (`aria-label`, `aria-labelledby`, `aria-multiselectable`) are read from the attributes.
 */
export type TreeListProps = VueToJSXProps<
    UIProps,
    'aria-label' | 'aria-labelledby' | 'aria-busy' | 'aria-multiselectable' | 'tabIndex'
>;

export const emitSchema = {
    /**
     * On a selection of a selectable tree item (Enter, Space or a click), in a standalone tree only.
     * In a combobox, the trigger `select` event (`Combobox.Input` or `Combobox.Button`) handles the selection.
     */
    select: (option: { value: string }) => !!option,
};

/**
 * TreeList component: a list in the WAI-ARIA tree pattern (`role="tree"`), with `TreeListItem` items.
 * Use `Combobox.OptionSkeleton`, `Combobox.State`, `Combobox.SelectionIcon` and `Combobox.OptionMoreInfo`
 * inside, as in a list.
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
        const compositeContext = useOptionalCompositeContext();
        const comboboxContext = useOptionalComboboxContext();
        // The combobox is the parent only when the nearest composite context is the one of `Combobox.Provider`
        // (same ID, no level). A list, a tree item or a standalone listbox in between makes the tree standalone.
        const isInCombobox =
            !!comboboxContext &&
            compositeContext?.id === comboboxContext.listboxId &&
            compositeContext.level === undefined;
        const generatedId = useId();
        // In a combobox, the trigger controls the tree with the combobox list ID (`aria-controls`).
        const id = computed(() => (isInCombobox ? comboboxContext.listboxId : props.id ?? generatedId));

        // Standalone: the tree owns focus (no focus owner link). The handle does not need the DOM element.
        const standaloneTree = shallowRef<TreeListHandle | null>(
            isInCombobox ? null : setupTreeList({ onSelect: (option) => emit('select', option) }),
        );
        // Tear down the handle (pending timers, subscribers) on unmount.
        onBeforeUnmount(() => standaloneTree.value?.destroy());

        const treeRef = ref<HTMLElement | null>(null);

        // Inside a combobox: create the tree list handle (linked to the trigger) and register it on the combobox.
        const {
            handle: tree,
            isOpen,
            isLoading,
        } = useCompositeList<TreeListHandle>({
            elementRef: treeRef,
            combobox: isInCombobox ? { handle: comboboxContext.handle, createList: setupTreeList } : undefined,
            standaloneHandle: standaloneTree,
        });

        provideCompositeContext({
            handle: tree,
            // Getters: keep the provided values reactive (read again on each consumer render).
            get id() {
                return id.value;
            },
            type: 'tree',
            get selectionType() {
                const multiselectable = attrs['aria-multiselectable'];
                return multiselectable === true || multiselectable === 'true' ? 'multiple' : 'single';
            },
            level: 0,
        });

        return () => {
            const { className: _className, ...forwardedAttrs } = attrs;
            return UI({
                ...forwardedAttrs,
                // Standalone: the tree itself is the (single) tab stop.
                tabIndex: tree.value?.isStandalone ? 0 : undefined,
                'aria-busy': isLoading.value || undefined,
                className: className.value,
                ref: treeRef,
                id: id.value,
                children: isOpen.value ? (slots.default?.() as JSXElement) : null,
            });
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        // Note: the ARIA attributes are not declared as props (Vue would normalize them to camelCase):
        // they are read from the attributes, where Vue keeps the original names.
        props: keysOf<TreeListProps>()('id', 'class'),
        emits: emitSchema,
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default TreeList;
