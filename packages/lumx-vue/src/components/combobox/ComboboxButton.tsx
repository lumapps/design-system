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
import { useComboboxEvent } from './context/useComboboxEvent';
import { useComboboxOpen } from './context/useComboboxOpen';

export type ComboboxButtonProps = VueToJSXProps<UIProps, 'label' | 'renderButton'> & {
    /** The label for the button (used for ARIA and tooltip). */
    label: string;
    /** The currently selected value to display. */
    value?: string;
    /** Controls how the label/value is displayed. @default 'show-selection' */
    labelDisplayMode?: ComboboxButtonLabelDisplayMode;
    /** Called when an option is selected. */
    onSelect?: (option: { value: string }) => void;
    /** Custom render function replacing the default `<Button>`. See `ComboboxButtonProps.renderButton` in core. */
    renderButton?: UIProps['renderButton'];
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
        const optionsState = useComboboxEvent('optionsChange', { optionsLength: 0 });
        const isLoading = useComboboxEvent('loadingChange', false);

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
            const {
                label,
                value,
                labelDisplayMode = 'show-selection',
                renderButton,
                class: _class,
                ...forwardedProps
            } = props;
            return UI(
                {
                    ...attrs,
                    ...forwardedProps,
                    label,
                    value,
                    labelDisplayMode,
                    renderButton,
                    listboxId,
                    isOpen: isOpen.value && (!!optionsState.value?.optionsLength || isLoading.value),
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
            'renderButton',
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
