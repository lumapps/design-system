import { computed, defineComponent, ref } from 'vue';

import {
    ComboboxOptionSkeleton as UI,
    type ComboboxOptionSkeletonProps as UIProps,
    type ComboboxOptionSkeletonPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxOptionSkeleton';
import type { JSXElement } from '@lumx/core/js/types';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useClassName } from '../../composables/useClassName';
import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { useComboboxContext } from './context/ComboboxContext';

export type ComboboxOptionSkeletonProps = VueToJSXProps<UIProps, ComboboxOptionSkeletonPropsToOverride>;

/**
 * Combobox.OptionSkeleton component — renders skeleton placeholder(s) inside a combobox list.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ComboboxOptionSkeleton = defineComponent(
    (props: ComboboxOptionSkeletonProps, { slots, attrs, expose }) => {
        const className = useClassName(() => props.class);
        const { handle } = useComboboxContext();

        // Expose the last rendered <li> element: the core template returns a Fragment
        // with multiple <ListItem> elements, so Vue's built-in $el would resolve to
        // the Fragment start anchor (empty Text node).
        // Note: the core template shares the same ref across all items — the last one wins
        // (same behavior as React).
        const skeletonRef = ref<any>(null);
        const skeletonEl = computed(() => skeletonRef.value?.$el as HTMLElement | undefined);
        expose({ $el: skeletonEl });

        // Register once with the combobox handle on mount
        useWatchDisposable(handle, (h) => h?.registerSkeleton());

        return () => {
            const before = attrs.before as JSXElement;
            const after = attrs.after as JSXElement;
            const children = slots.default?.() as JSXElement;

            return UI({
                ...attrs,
                ref: skeletonRef,
                className: className.value,
                count: props.count,
                before,
                after,
                children,
            } as any);
        };
    },
    {
        name: 'LumxComboboxOptionSkeleton',
        inheritAttrs: false,
        props: keysOf<ComboboxOptionSkeletonProps>()('hasDescription', 'count', 'class'),
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ComboboxOptionSkeleton;
