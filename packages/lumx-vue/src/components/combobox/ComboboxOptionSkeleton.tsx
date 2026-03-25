import { defineComponent } from 'vue';

import {
    ComboboxOptionSkeleton as UI,
    type ComboboxOptionSkeletonProps as UIProps,
    type ComboboxOptionSkeletonPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxOptionSkeleton';
import type { JSXElement } from '@lumx/core/js/types';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
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
    (props: ComboboxOptionSkeletonProps, { slots, attrs }) => {
        const { handle } = useComboboxContext();

        // Register once with the combobox handle on mount
        useWatchDisposable(handle, (h) => h?.registerSkeleton());

        return () => {
            const before = attrs.before as JSXElement;
            const after = attrs.after as JSXElement;
            const children = slots.default?.() as JSXElement;

            return UI({ ...attrs, className: props.class, count: props.count, before, after, children } as any);
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
