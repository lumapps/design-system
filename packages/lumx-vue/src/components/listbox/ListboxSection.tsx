import { defineComponent, reactive, ref } from 'vue';

import { useClassName } from '../../composables/useClassName';

import {
    ListboxSection as UI,
    type ListboxSectionProps as UIProps,
    type ListboxSectionPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Listbox/ListboxSection';
import type { JSXElement } from '@lumx/core/js/types';

import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { ListSection } from '../list';
import { useListboxContext } from './context/ListboxContext';

export type ListboxSectionProps = VueToJSXProps<UIProps, ListboxSectionPropsToOverride | 'hidden' | 'aria-hidden'>;

/**
 * Combobox.Section component - groups Combobox.Option items under a labelled section.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ListboxSection = defineComponent(
    (props: ListboxSectionProps, { slots }) => {
        const className = useClassName(() => props.class);
        const { list } = useListboxContext();
        const sectionRef = ref<HTMLElement | null>(null);
        const sectionState = reactive({ hidden: false, 'aria-hidden': false });

        // Register with the combobox handle for section state notifications.
        // Watch both handle and sectionRef so registration fires as soon as both are available.
        useWatchDisposable([list, sectionRef], ([h, element]) => {
            if (h && element) {
                return h.registerSection(element, (state) => {
                    sectionState.hidden = state.hidden;
                    sectionState['aria-hidden'] = state['aria-hidden'];
                });
            }
        });

        const setSectionRef = (el: any) => {
            // When ListSection is used directly (no adapter), `el` is the component instance.
            // Unwrap `$el` to get the root DOM element.
            sectionRef.value = (el?.$el ?? el) as HTMLElement | null;
        };

        return () => {
            const children = slots.default?.();
            // Return null when children is empty so the section header is not rendered as an orphan
            if (!children || children.length === 0) return null;

            // Use the label slot content as JSX when no label prop is provided.
            const label = (props.label ?? slots.label?.()) as string | JSXElement | undefined;

            return UI(
                {
                    label,
                    icon: props.icon,
                    className: className.value,
                    hidden: sectionState.hidden,
                    'aria-hidden': sectionState['aria-hidden'] || undefined,
                    ref: setSectionRef as any,
                    children: children as JSXElement,
                },
                { ListSection },
            );
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<ListboxSectionProps>()('label', 'icon', 'class'),
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ListboxSection;
