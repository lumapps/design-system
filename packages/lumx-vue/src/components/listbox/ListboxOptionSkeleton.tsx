import { defineComponent } from 'vue';

import {
    ListboxOptionSkeleton as UI,
    type ListboxOptionSkeletonProps as UIProps,
    type ListboxOptionSkeletonPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Listbox/ListboxOptionSkeleton';
import type { JSXElement } from '@lumx/core/js/types';

import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useClassName } from '../../composables/useClassName';
import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { useCompositeContext } from '../composite/CompositeContext';

export type ListboxOptionSkeletonProps = VueToJSXProps<UIProps, ListboxOptionSkeletonPropsToOverride>;

/**
 * Combobox.OptionSkeleton component — renders skeleton placeholder(s) inside a combobox list.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ListboxOptionSkeleton = defineComponent(
    (props: ListboxOptionSkeletonProps, { slots, attrs }) => {
        const className = useClassName(() => props.class);
        const compositeContext = useCompositeContext();

        // Register once with the composite handle on mount
        // (a skeleton in a nested level of items does not make the whole list busy).
        useWatchDisposable(compositeContext.handle, (h) =>
            h?.registerSkeleton({ isNested: (compositeContext.level ?? 0) > 0 }),
        );

        return () => {
            const before = attrs.before as JSXElement;
            const after = attrs.after as JSXElement;
            const children = slots.default?.() as JSXElement;

            return UI({
                ...attrs,
                className: className.value,
                count: props.count,
                before,
                after,
                children,
            } as any);
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<ListboxOptionSkeletonProps>()('hasDescription', 'count', 'class'),
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ListboxOptionSkeleton;
