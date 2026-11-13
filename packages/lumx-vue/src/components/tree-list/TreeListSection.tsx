import { type ComponentPublicInstance, computed, defineComponent, reactive, ref, watch } from 'vue';

import {
    TreeListSection as UI,
    type TreeListSectionProps as UIProps,
    type TreeListSectionPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/TreeList/TreeListSection';
import { isTreeListHandle } from '@lumx/core/js/components/TreeList/utils';
import type { JSXElement } from '@lumx/core/js/types';

import { useClassName } from '../../composables/useClassName';
import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { ListSection } from '../list';
import { useOptionalCompositeContext } from '../composite/CompositeContext';
import { hasContent } from './hasContent';

export type TreeListSectionProps = VueToJSXProps<UIProps, TreeListSectionPropsToOverride | 'hidden'> & {
    /**
     * Section label, shown as the section title (visual only), when the `label` slot is not used. Without a
     * label, the section is a plain group.
     */
    label?: string;
};

/**
 * TreeListSection component: a section of root tree items in a `TreeList`, with an optional label (`label`
 * prop or slot). Default slot: the `TreeListItem` elements.
 *
 * - The sections get a divider between them (and between them and the standalone tree items). Use a section
 *   without a label as a separator.
 * - Root level only: the tree items of a section are root tree items. Do not use it in a tree item.
 * - With `filter="auto"`, the section is hidden when the filter hides all of its tree items.
 * - The label is visual only: the section has no ARIA semantics (a group in a tree changes the tree item levels).
 * - Renders nothing without children.
 *
 * @param props Component props.
 * @return Vue element.
 */
const TreeListSection = defineComponent(
    (props: TreeListSectionProps, { slots, attrs }) => {
        const className = useClassName(() => props.class);
        const compositeContext = useOptionalCompositeContext();
        const tree = computed(() => {
            const handle = compositeContext?.handle.value;
            return isTreeListHandle(handle) ? handle : null;
        });
        watch(
            () => !!compositeContext?.level,
            (isNested) => {
                if (isNested) {
                    console.warn(
                        `[@lumx/vue/${COMPONENT_NAME}] ${COMPONENT_NAME} must be used at the root of a TreeList.`,
                    );
                }
            },
            { immediate: true },
        );
        const sectionRef = ref<HTMLElement | null>(null);
        const state = reactive({ hidden: false });

        // Register on the tree for the filter state.
        useWatchDisposable([tree, sectionRef], ([treeValue, element]) => {
            if (!treeValue || !element) return undefined;
            return treeValue.registerSection(element, (value) => {
                state.hidden = value.hidden;
            });
        });

        const setSectionRef = (el: Element | ComponentPublicInstance | null) => {
            // The ref of the ListSection component: unwrap `$el` to get the root DOM element.
            sectionRef.value = ((el && '$el' in el ? el.$el : el) ?? null) as HTMLElement | null;
        };

        return () => {
            const children = slots.default?.();
            if (!hasContent(children)) return null;

            return UI(
                {
                    ...attrs,
                    label: (slots.label?.() ?? props.label) as JSXElement,
                    icon: props.icon,
                    className: className.value,
                    hidden: state.hidden,
                    ref: setSectionRef,
                    children: children as JSXElement,
                },
                { ListSection },
            );
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<TreeListSectionProps>()('label', 'icon', 'class'),
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default TreeListSection;
