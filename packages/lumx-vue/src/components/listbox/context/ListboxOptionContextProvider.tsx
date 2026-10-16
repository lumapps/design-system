import { type PropType, defineComponent } from 'vue';

import { type ListboxOptionContextValue, provideListboxOptionContext } from './ListboxOptionContext';

/**
 * Provides the option context to its slot only (e.g. the `before` and `after` content of a TreeListItem,
 * not its label or its sub-items), like the React `ListboxOptionContext.Provider`.
 */
export const ListboxOptionContextProvider = defineComponent(
    (props: { value: ListboxOptionContextValue }, { slots }) => {
        // Getters keep the provided values reactive.
        provideListboxOptionContext({
            get optionId() {
                return props.value.optionId;
            },
            get isSelected() {
                return props.value.isSelected;
            },
            get isSelectable() {
                return props.value.isSelectable;
            },
        });
        return () => slots.default?.();
    },
    {
        name: 'LumxListboxOptionContextProvider',
        props: { value: { type: Object as PropType<ListboxOptionContextValue>, required: true } },
    },
);
