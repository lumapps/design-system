import { computed, defineComponent, reactive, ref } from 'vue';

import { useClassName } from '../../composables/useClassName';

import {
    ComboboxSection as UI,
    type ComboboxSectionProps as UIProps,
    type ComboboxSectionPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxSection';
import type { JSXElement } from '@lumx/core/js/types';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { ListSection } from '../list';
import { useComboboxContext } from './context/ComboboxContext';

export type ComboboxSectionProps = VueToJSXProps<UIProps, ComboboxSectionPropsToOverride | 'hidden' | 'aria-hidden'>;

/**
 * Combobox.Section component - groups Combobox.Option items under a labelled section.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ComboboxSection = defineComponent(
    (props: ComboboxSectionProps, { slots }) => {
        const className = useClassName(() => props.class);
        const { handle } = useComboboxContext();
        const sectionState = reactive({ hidden: false, 'aria-hidden': false });

        // Ref to the ListSection component instance (with exposed `$el`).
        const listSectionRef = ref<any>(null);
        // Resolved DOM element (<li>) from the ListSection's exposed $el.
        const sectionEl = computed(() => listSectionRef.value?.$el as HTMLElement | undefined);

        // Register with the combobox handle for section state notifications.
        // Watch both handle and sectionEl so registration fires as soon as both are available.
        useWatchDisposable([handle, sectionEl], ([h, element]) => {
            if (!h || !element) return;

            return h.registerSection(element, (state) => {
                sectionState.hidden = state.hidden;
                sectionState['aria-hidden'] = state['aria-hidden'];
            });
        });

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
                    ref: listSectionRef,
                    children: children as JSXElement,
                },
                { ListSection },
            );
        };
    },
    {
        name: 'LumxComboboxSection',
        inheritAttrs: false,
        props: keysOf<ComboboxSectionProps>()('label', 'icon', 'class'),
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ComboboxSection;
