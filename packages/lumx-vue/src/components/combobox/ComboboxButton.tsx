import { defineComponent, onUnmounted, ref, useAttrs, watch } from 'vue';

import {
    ComboboxButton as UI,
    type ComboboxButtonProps as UIProps,
    type ComboboxButtonLabelDisplayMode,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxButton';
import { setupComboboxButton } from '@lumx/core/js/components/Combobox/setupComboboxButton';

import { useClassName } from '../../composables/useClassName';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Button } from '../button';
import { Tooltip } from '../tooltip';
import { useComboboxContext } from './context/ComboboxContext';
import { useComboboxOpen } from './context/useComboboxOpen';

export type ComboboxButtonProps = VueToJSXProps<UIProps, 'label'> & {
    /** The label for the button (used for ARIA and tooltip). */
    label: string;
    /** The currently selected value to display. */
    value?: string;
    /** Controls how the label/value is displayed. @default 'show-selection' */
    labelDisplayMode?: ComboboxButtonLabelDisplayMode;
};

/**
 * Combobox.Button component - Button trigger for select-only combobox mode.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ComboboxButton = defineComponent(
    (props: ComboboxButtonProps, { emit }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);
        const { listboxId, anchorRef, setHandle, handle } = useComboboxContext();
        const { isOpen } = useComboboxOpen();

        const buttonRef = ref<HTMLElement | null>(null);

        // Create the combobox handle with button-mode controller on mount
        watch(
            buttonRef,
            (button) => {
                if (!button) return;
                setHandle(
                    setupComboboxButton(button as HTMLButtonElement, {
                        onSelect(option) {
                            props.onSelect?.(option);
                            emit('select', option);
                        },
                    }),
                );
                // Set anchor ref to the button element
                anchorRef.value = button;
            },
            { immediate: false },
        );

        onUnmounted(() => {
            handle.value?.destroy();
            setHandle(null);
        });

        return () => {
            const { label, value, labelDisplayMode = 'show-selection', class: _class, ...forwardedProps } = props;
            return UI(
                {
                    ...attrs,
                    ...forwardedProps,
                    label,
                    value,
                    labelDisplayMode,
                    listboxId,
                    isOpen: isOpen.value,
                    ref: (el: any) => {
                        // Handle both component instances and raw elements
                        buttonRef.value = el?.$el ?? el;
                        anchorRef.value = buttonRef.value;
                    },
                    className: className.value,
                },
                { Button, Tooltip },
            );
        };
    },
    {
        name: 'LumxComboboxButton',
        inheritAttrs: false,
        props: keysOf<ComboboxButtonProps>()(
            'class',
            'label',
            'value',
            'labelDisplayMode',
            'listboxId',
            'isOpen',
            'onSelect',
        ),
        emits: {
            select: (option: { value: string }) => !!option,
        },
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ComboboxButton;
