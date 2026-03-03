import { computed, defineComponent, mergeProps, useAttrs } from 'vue';

import {
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    type PopoverDialogProps as CorePopoverDialogProps,
} from '@lumx/core/js/components/PopoverDialog';
import type { PopoverProps as CorePopoverProps } from '@lumx/core/js/components/Popover';
import { classNames } from '@lumx/core/js/utils';

import { keysOf } from '../../utils/VueToJSX';
import Popover, { type PopoverProps } from '../popover/Popover';
import HeadingLevelProvider from '../heading/HeadingLevelProvider';

/**
 * Vue PopoverDialog props.
 * Extends the Vue Popover props with dialog-specific accessible label props from core.
 */
export type PopoverDialogProps = PopoverProps & Omit<CorePopoverDialogProps, keyof CorePopoverProps>;

export const emitSchema = {
    close: () => true,
};

const PopoverDialog = defineComponent(
    (props: PopoverDialogProps, { emit, slots }) => {
        const attrs = useAttrs();
        const className = computed(() => classNames.join(props.class, CLASSNAME));

        // Vue normalizes hyphenated prop names to camelCase, so 'aria-label' prop becomes 'ariaLabel'.
        // We also check attrs for aria-label when it's not declared as a prop.
        const ariaLabel = computed(() => props.label ?? (props as any).ariaLabel ?? (attrs as any)['aria-label']);

        const handleClose = () => emit('close');

        return () => {
            const { label: _label, 'aria-label': _ariaLabel, class: _class, ...forwardedProps } = props;

            return (
                <Popover
                    {...forwardedProps}
                    {...mergeProps(attrs, { role: 'dialog', 'aria-modal': 'true', 'aria-label': ariaLabel.value })}
                    class={className.value}
                    closeOnClickAway
                    closeOnEscape
                    withFocusTrap
                    onClose={handleClose}
                >
                    <HeadingLevelProvider level={2}>{slots.default?.()}</HeadingLevelProvider>
                </Popover>
            );
        };
    },
    {
        name: `Lumx${COMPONENT_NAME}`,
        inheritAttrs: false,
        props: keysOf<PopoverDialogProps>()(
            'anchorRef',
            'aria-label',
            'aria-labelledby',
            'as',
            'boundaryRef',
            'closeMode',
            'closeOnClickAway',
            'closeOnEscape',
            'elevation',
            'fitToAnchorWidth',
            'fitWithinViewportHeight',
            'focusAnchorOnClose',
            'focusElement',
            'hasArrow',
            'isOpen',
            'label',
            'offset',
            'parentElement',
            'placement',
            'usePortal',
            'focusTrapZoneElement',
            'withFocusTrap',
            'zIndex',
            'theme',
            'class',
        ),
        emits: emitSchema,
    },
);

export default PopoverDialog;

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };
