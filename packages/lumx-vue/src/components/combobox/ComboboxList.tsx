import { defineComponent, ref, useAttrs } from 'vue';

import {
    ComboboxList as UI,
    type ComboboxListProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxList';
import type { JSXElement } from '@lumx/core/js/types';

import { useClassName } from '../../composables/useClassName';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { useComboboxContext } from './context/ComboboxContext';
import { useComboboxEvent } from './context/useComboboxEvent';
import { provideComboboxListContext } from './context/ComboboxListContext';

export type ComboboxListProps = VueToJSXProps<UIProps, 'aria-label' | 'aria-busy' | 'id'>;

/**
 * Combobox.List component - wraps List with listbox ARIA attributes.
 * Registers itself as the combobox listbox on mount.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ComboboxList = defineComponent(
    (props: ComboboxListProps, { slots }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);
        const { listboxId, handle } = useComboboxContext();
        const listRef = ref<HTMLElement | null>(null);

        provideComboboxListContext({ type: props.type || 'listbox' });

        // Register the list as the listbox when both handle and list element are available
        useWatchDisposable([handle, listRef], ([handleValue, list]) => {
            if (!handleValue || !list) return;
            return handleValue.registerListbox(list);
        });

        // Track loading state for aria-busy
        const isLoading = useComboboxEvent('loadingChange', false);

        return () => {
            const children = slots.default?.() as JSXElement;
            // Get aria-label and aria-multiselectable from attrs (Vue normalizes hyphenated prop
            // names to camelCase in props, so we read from attrs to get the original values)
            const ariaLabel = (attrs['aria-label'] ?? '') as string;
            const ariaMultiselectable = attrs['aria-multiselectable'] as boolean | undefined;
            return UI({
                'aria-label': ariaLabel,
                'aria-multiselectable': ariaMultiselectable || undefined,
                'aria-busy': isLoading.value || undefined,
                className: className.value,
                ref: listRef as any,
                id: listboxId,
                type: props.type || 'listbox',
                children,
            } as any);
        };
    },
    {
        name: 'LumxComboboxList',
        inheritAttrs: false,
        // Note: 'aria-label' is intentionally NOT declared as a prop because Vue normalizes
        // hyphenated prop names to camelCase (ariaLabel) internally, making it inaccessible
        // via props['aria-label']. Instead, we read it from attrs where Vue keeps the original name.
        props: keysOf<ComboboxListProps>()('type', 'class'),
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ComboboxList;
