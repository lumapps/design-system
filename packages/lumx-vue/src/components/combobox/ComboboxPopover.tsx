import { computed, defineComponent } from 'vue';

import {
    ComboboxPopover as UI,
    type ComboboxPopoverProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxPopover';
import type { JSXElement } from '@lumx/core/js/types';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Popover } from '../popover';
import type { PopoverProps } from '../popover/Popover';
import { useComboboxContext } from './context/ComboboxContext';
import { useComboboxOpen } from './context/useComboboxOpen';
import { FlexBox } from '../flex-box';

/**
 * Adapter: maps core's `className` prop to Vue's `class` prop for Popover.
 * Also maps `anchorRef` (passed as CommonRef from core) to a Vue-compatible ref.
 * Children are received as Vue slots and forwarded to the Popover component.
 */
const PopoverAdapter = (p: any, { slots }: any) => {
    const { className, onClose, anchorRef, ...rest } = p;
    return (
        <Popover class={className} anchorRef={anchorRef} onClose={onClose} {...rest}>
            {{ default: slots.default }}
        </Popover>
    );
};

/**
 * Props type extends the core ComboboxPopover props (via VueToJSXProps) with additional
 * Popover passthrough props. The core type only declares props it explicitly uses;
 * extra Popover props flow through the core template's `...forwardedProps` spread.
 */
export type ComboboxPopoverProps = VueToJSXProps<UIProps, 'isOpen' | 'anchorRef'> &
    Partial<Omit<PopoverProps, 'isOpen' | 'anchorRef' | 'onClose' | 'class'>>;

/**
 * Combobox.Popover component - renders a Popover connected to the combobox context.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ComboboxPopover = defineComponent(
    (props: ComboboxPopoverProps, { slots }) => {
        const { anchorRef } = useComboboxContext();
        const { isOpen, setIsOpen } = useComboboxOpen();

        // Adapt anchorRef: Popover expects Ref<HTMLElement | undefined> | HTMLElement
        const popoverAnchorRef = computed(() => anchorRef.value ?? undefined);

        return () => {
            const { class: className, ...popoverProps } = props;

            return UI(
                {
                    ...popoverProps,
                    children: slots.default?.() as JSXElement,
                    className,
                    isOpen: isOpen.value,
                    anchorRef: popoverAnchorRef as any,
                    handleClose: () => setIsOpen(false),
                },
                { Popover: PopoverAdapter, FlexBox },
            );
        };
    },
    {
        name: 'LumxComboboxPopover',
        inheritAttrs: false,
        props: keysOf<ComboboxPopoverProps>()(
            'as',
            'boundaryRef',
            'class',
            'closeMode',
            'closeOnClickAway',
            'closeOnEscape',
            'elevation',
            'fitToAnchorWidth',
            'fitWithinViewportHeight',
            'focusAnchorOnClose',
            'focusElement',
            'focusTrapZoneElement',
            'hasArrow',
            'offset',
            'parentElement',
            'placement',
            'theme',
            'usePortal',
            'withFocusTrap',
            'zIndex',
        ),
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ComboboxPopover;
