import { computed, defineComponent, useAttrs } from 'vue';

import { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS } from '@lumx/core/js/components/PopoverDialog';
import { classNames } from '@lumx/core/js/utils';

import { keysOf } from '../../utils/VueToJSX';
import Popover, { type PopoverProps } from '../popover/Popover';
import HeadingLevelProvider from '../heading/HeadingLevelProvider';

/**
 * Vue PopoverDialog props.
 * Extends the Vue Popover props with dialog-specific accessible label props.
 */
export type PopoverDialogProps = PopoverProps & {
    /** Accessible label for the dialog. Use either aria-label or aria-labelledby. */
    'aria-label'?: string;
    /** The id of the element to use as title of the dialog. */
    'aria-labelledby'?: string;
    /** Accessible label for the dialog (shorthand for aria-label). */
    label?: string;
};

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

        const handleClose = () => {
            emit('close');
        };

        return () => {
            const { label: _label, 'aria-label': _ariaLabel, class: _class, ...forwardedProps } = props;

            // Cast to `any` to allow passing dialog-specific attributes (role, aria-modal, aria-label)
            // that are not declared in Popover's typed props but are forwarded via its `...attrs` spread.
            const PopoverAny = Popover as any;

            return (
                <PopoverAny
                    {...forwardedProps}
                    {...attrs}
                    class={className.value}
                    role="dialog"
                    aria-modal="true"
                    aria-label={ariaLabel.value}
                    closeOnClickAway
                    closeOnEscape
                    withFocusTrap
                    onClose={handleClose}
                >
                    <HeadingLevelProvider level={2}>{slots.default?.()}</HeadingLevelProvider>
                </PopoverAny>
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
