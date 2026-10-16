import { computed, defineComponent, ref, shallowRef, useAttrs, watch } from 'vue';

import {
    ListboxList as UI,
    type ListboxListProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Listbox/ListboxList';
import type { JSXElement } from '@lumx/core/js/types';
import { setupListbox } from '@lumx/core/js/components/Listbox/setupListbox';
import type { ListboxHandle } from '@lumx/core/js/components/Listbox/types';

import { useClassName } from '../../composables/useClassName';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { provideCompositeContext, useCompositeContext } from '../composite/CompositeContext';
import { useCompositeEvent } from '../composite/useCompositeEvent';
import { useOptionalComboboxContext } from '../combobox/context/ComboboxContext';
import { useListboxHandle } from './context/useListboxHandle';

export type ListboxListProps = VueToJSXProps<UIProps, 'aria-label' | 'aria-busy' | 'aria-multiselectable' | 'id'>;

/**
 * List component (`Combobox.List` and `Listbox.List`): the WAI-ARIA listbox pattern by default (`role="listbox"` with
 * `role="option"` items), or the grid pattern with `type="grid"` (`role="grid"` with one
 * `role="row"` per option, made of the option `role="gridcell"` and its action cells).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 *
 * Mounts a listbox handle on its element:
 * - Inside a combobox (`Combobox.Provider`): creates the listbox handle with the combobox list options and
 *   registers it on the combobox. Renders its options only while the combobox is open. The trigger owns focus.
 * - Inside a `ListboxProvider`: a standalone list that owns focus (`tabindex="0"` +
 *   `aria-activedescendant`) and handles its own keyboard navigation. A `ListboxProvider` nested
 *   in a combobox wins (the list stays standalone and does not register on the combobox).
 *
 * @param props Component props.
 * @return Vue element.
 */
const ListboxList = defineComponent(
    (props: ListboxListProps, { slots }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);
        const { id: listboxId } = useCompositeContext();
        const providedList = useListboxHandle();
        const comboboxContext = useOptionalComboboxContext();
        const listRef = ref<HTMLElement | null>(null);

        // A nearer standalone listbox (`ListboxProvider` inside the combobox) wins over the combobox.
        // Inside a combobox, the provided handle is the registered list, which is linked (not standalone).
        const isStandalone = computed(() => !!providedList.value?.isStandalone);

        // Inside a combobox: create the listbox handle (linked to the trigger) and register it on the combobox.
        const comboboxList = shallowRef<ListboxHandle | null>(null);
        if (comboboxContext) {
            useWatchDisposable([comboboxContext.handle, isStandalone], ([combobox, standalone]) => {
                if (!combobox || standalone) return undefined;
                const newList = setupListbox(combobox.listOptions);
                const unregister = combobox.registerList(newList);
                comboboxList.value = newList;
                return () => {
                    unregister();
                    newList.destroy();
                    if (comboboxList.value === newList) comboboxList.value = null;
                };
            });
        }
        const list = computed(() => (isStandalone.value || !comboboxContext ? providedList.value : comboboxList.value));

        const type = computed(() => props.type || 'listbox');
        provideCompositeContext({
            handle: list,
            id: listboxId,
            level: 0,
            // Getter: keeps the provided `type` reactive (read again on each consumer render).
            get type() {
                return type.value;
            },
            get selectionType() {
                const multiselectable = attrs['aria-multiselectable'];
                return multiselectable === true || multiselectable === 'true' ? 'multiple' : 'single';
            },
        });

        // Mount the list element on the handle.
        useWatchDisposable([list, listRef], ([listValue, element]) => {
            if (!listValue || !element) return undefined;
            return listValue.mount(element);
        });

        // Tracking states (options are rendered only while visible: standalone always, combobox while open)
        const isLoading = useCompositeEvent(list, 'loadingChange', false);
        const isOpen = useCompositeEvent(list, 'open', false);
        const options = useCompositeEvent(list, 'optionsChange', undefined);

        // Flush pending navigation (that could not run when hidden)
        watch(
            [isOpen, () => options.value?.optionsLength],
            () => {
                if (isOpen.value) list.value?.flushPendingNavigation();
            },
            { flush: 'post' },
        );

        return () => {
            const children = isOpen.value ? (slots.default?.() as JSXElement) : null;
            // Get aria-label and aria-multiselectable from attrs (Vue normalizes hyphenated prop
            // names to camelCase in props, so we read from attrs to get the original values)
            const ariaLabel = (attrs['aria-label'] ?? '') as string;
            const ariaLabelledBy = attrs['aria-labelledby'] as string | undefined;
            const ariaMultiselectable = attrs['aria-multiselectable'] as boolean | undefined;
            return UI({
                'aria-label': ariaLabel || undefined,
                'aria-labelledby': ariaLabelledBy,
                'aria-multiselectable': ariaMultiselectable || undefined,
                'aria-busy': isLoading.value || undefined,
                // Standalone: the list itself is the (single) tab stop.
                tabIndex: list.value?.isStandalone ? 0 : undefined,
                className: className.value,
                ref: listRef as any,
                id: listboxId,
                type: type.value,
                children,
            } as any);
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        // Note: 'aria-label' is intentionally NOT declared as a prop because Vue normalizes
        // hyphenated prop names to camelCase (ariaLabel) internally, making it inaccessible
        // via props['aria-label']. Instead, we read it from attrs where Vue keeps the original name.
        props: keysOf<ListboxListProps>()('type', 'class'),
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ListboxList;
