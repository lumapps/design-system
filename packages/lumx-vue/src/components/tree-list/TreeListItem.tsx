import { Comment, Fragment, Text, type VNode, computed, defineComponent, h, ref, watch } from 'vue';

import {
    TreeListItem as UI,
    type TreeListItemProps as UIProps,
    type TreeListItemPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/TreeList/TreeListItem';
import {
    setupTreeListItem,
    type TreeListItemController,
    type TreeListItemState,
} from '@lumx/core/js/components/TreeList/setupTreeListItem';
import { optionActiveEvent } from '@lumx/core/js/components/Composite/constants';
import { isTreeListHandle } from '@lumx/core/js/components/TreeList/utils';
import type { JSXElement } from '@lumx/core/js/types';

import { useId } from '../../composables/useId';
import { useClassName } from '../../composables/useClassName';
import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Tooltip } from '../tooltip';
import type { TooltipProps } from '../tooltip/Tooltip';
import { provideCompositeContext, useOptionalCompositeContext } from '../composite/CompositeContext';
import { useCompositeEvent } from '../composite/useCompositeEvent';
import type { ListboxOptionContextValue } from '../listbox/context/ListboxOptionContext';
import { ListboxOptionContextProvider } from '../listbox/context/ListboxOptionContextProvider';

export type TreeListItemProps = VueToJSXProps<
    UIProps,
    | TreeListItemPropsToOverride
    | 'id'
    | 'descriptionId'
    | 'isParent'
    | 'isOpen'
    | 'hidden'
    | 'level'
    | 'handleClick'
    | 'handleToggleClick'
> & {
    /** Content of the row (the tree item label), when the `label` slot is not used. */
    label?: string;
    /**
     * Make a lazy parent item: a parent item with no sub-items until the user opens it (load the
     * sub-items on `openChange`). Not needed when sub-items are present.
     * In a combobox, the open state resets on each popup open: cache the loaded sub-items.
     */
    hasSubItems?: boolean;
    /** Props forwarded to a Tooltip wrapping the `role="treeitem"` element. */
    tooltipProps?: Partial<TooltipProps>;
    /** Props forwarded to the inner `role="treeitem"` element. */
    actionProps?: Record<string, any>;
};

export const emitSchema = {
    /**
     * On every open and close by the user (expand toggle, Right, Left, Enter or a click on a
     * non-selectable parent item). Not emitted for the initial state or for the filter.
     */
    openChange: (isOpen: boolean) => typeof isOpen === 'boolean',
    /** On tree item clicked (or activated with Enter), selectable or not. */
    click: () => true,
};

/** Whether the rendered slot content is not empty (ignores comments and blank text). */
function hasContent(nodes: unknown): boolean {
    if (!Array.isArray(nodes)) return false;
    return nodes.some((node: VNode) => {
        if (!node || typeof node !== 'object') return false;
        if (node.type === Comment) return false;
        if (node.type === Text) return String(node.children ?? '').trim() !== '';
        if (node.type === Fragment) return hasContent(node.children);
        return true;
    });
}

/**
 * TreeListItem component: one tree item of a `TreeList`, with its sub-items (default slot: `TreeListItem`,
 * `Combobox.OptionSkeleton` or `Combobox.State`). Label: the `label` slot, or the `label` prop.
 * The `before` and `after` slots take e.g. an icon, `Combobox.SelectionIcon` or `Combobox.OptionMoreInfo`.
 *
 * - With a `value`, the tree item is selectable (Enter or a click selects it). Without, it is not:
 *   Enter or a click on a non-selectable parent item opens or closes it, and on a non-selectable
 *   leaf item only emits `click` (e.g. an action such as "Create a new list…").
 * - The open state is internal: a parent item starts open when a sub-item at any depth is selected.
 *   In a combobox, it resets on each popup open.
 * - Touch screen readers: TalkBack (Chrome) can open and close the parent items. On iOS, a user can
 *   only reach the sub-items of a selectable parent item through the filter. To support it, use a
 *   non-selectable parent item with an "All <name>" leaf item that carries the parent value.
 *
 * @param props Component props.
 * @return Vue element.
 */
const TreeListItem = defineComponent(
    (props: TreeListItemProps, { slots, emit, attrs }) => {
        const className = useClassName(() => props.class);
        const compositeContext = useOptionalCompositeContext();
        if (!compositeContext) {
            throw new Error(`${COMPONENT_NAME} must be used within a TreeList`);
        }
        const level = compositeContext.level ?? 0;
        const tree = computed(() =>
            isTreeListHandle(compositeContext.handle.value) ? compositeContext.handle.value : null,
        );
        // Inside another composite (e.g. a `Combobox.List`), the tree item is never registered: it stays inert.
        watch(
            () => !!compositeContext.handle.value && !tree.value,
            (isOutsideTree) => {
                if (isOutsideTree) {
                    console.warn(`[@lumx/vue/${COMPONENT_NAME}] ${COMPONENT_NAME} must be used within a TreeList.`);
                }
            },
            { immediate: true },
        );
        const id = useId();
        const descriptionId = useId();
        const liRef = ref<HTMLElement | null>(null);
        const state = ref<TreeListItemState>({ isOpen: false, hidden: false });
        let controller: TreeListItemController | null = null;
        /** Whether the tree item is a parent item (updated on each render). */
        let isParent = Boolean(props.hasSubItems);

        // Force the tooltip open while the tree item is the active item (keyboard highlight).
        const isActive = useCompositeEvent(tree, optionActiveEvent(id), false);

        // The sub-items are one level deeper (a skeleton in a group does not make the tree busy).
        provideCompositeContext({
            handle: compositeContext.handle,
            get id() {
                return compositeContext.id;
            },
            get type() {
                return compositeContext.type;
            },
            get selectionType() {
                return compositeContext.selectionType;
            },
            level: level + 1,
        });

        // Sync flush: set up on mount (the sub-items are in the DOM), before the tree replays a pending
        // keyboard navigation (it needs the initial open state from a selected sub-item).
        useWatchDisposable(
            [tree, liRef],
            ([treeValue, element]) => {
                if (!treeValue || !element) return undefined;
                controller = setupTreeListItem({
                    tree: treeValue,
                    element,
                    id,
                    isParent: () => isParent,
                    onOpenChange: (isOpen) => emit('openChange', isOpen),
                    onChange: (value) => {
                        state.value = value;
                    },
                });
                state.value = controller.state;
                return () => {
                    controller?.destroy();
                    controller = null;
                };
            },
            { immediate: true, flush: 'sync' },
        );

        const handleClick = () => {
            emit('click');
            // The tree list selects a selectable tree item. A non-selectable parent item opens or closes.
            if (props.value === undefined) controller?.toggle();
        };

        const setLiRef = (el: Element | null) => {
            liRef.value = el as HTMLElement | null;
        };

        /** Get slot content, falling back to attrs (JSX prop syntax used in tests). */
        const getSlotOrAttr = (name: string) => (slots[name]?.() ?? attrs[name]) as JSXElement;

        /** Wrap `before` and `after` in an option context (`Combobox.SelectionIcon`, `Combobox.OptionMoreInfo`). */
        const wrapInOptionContext = (node: JSXElement) => {
            if (!node) return undefined;
            const value: ListboxOptionContextValue = {
                optionId: id,
                isSelected: Boolean(props.isSelected),
                isSelectable: props.value !== undefined,
            };
            return h(ListboxOptionContextProvider, { value }, () => node) as JSXElement;
        };

        return () => {
            const children = slots.default?.();
            isParent = Boolean(props.hasSubItems) || hasContent(children);
            const { tooltipProps } = props;
            const { before: _before, after: _after, ...forwardedAttrs } = attrs;

            return UI(
                {
                    ...forwardedAttrs,
                    ref: setLiRef,
                    id,
                    descriptionId,
                    label: (slots.label?.() ?? props.label) as JSXElement,
                    value: props.value,
                    description: props.description,
                    isSelected: props.isSelected,
                    isParent,
                    level,
                    isOpen: isParent && state.value.isOpen,
                    hidden: state.value.hidden,
                    before: wrapInOptionContext(getSlotOrAttr('before')),
                    after: wrapInOptionContext(getSlotOrAttr('after')),
                    actionProps: props.actionProps,
                    handleClick,
                    handleToggleClick: () => controller?.toggle(),
                    tooltipProps: tooltipProps && {
                        ...tooltipProps,
                        forceOpen: tooltipProps.forceOpen || isActive.value,
                    },
                    className: className.value,
                    children: (isParent ? children : null) as JSXElement,
                },
                { Tooltip },
            );
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<TreeListItemProps>()(
            'label',
            'value',
            'description',
            'isSelected',
            'hasSubItems',
            'tooltipProps',
            'actionProps',
            'class',
        ),
        emits: emitSchema,
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default TreeListItem;
