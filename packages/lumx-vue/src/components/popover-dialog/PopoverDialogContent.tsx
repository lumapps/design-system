import { computed, defineComponent, mergeProps } from 'vue';

import { CLASSNAME } from '@lumx/core/js/components/PopoverDialog';
import { classNames } from '@lumx/core/js/utils';
import { resolveAccessibleNameProps } from '@lumx/core/js/utils/aria/resolveAccessibleNameProps';
import { DIALOG_LABEL_KEY } from '@lumx/core/js/components/Dialog/constants';
import { useClassName } from '@lumx/vue/composables/useClassName';

import { useRegisteredId } from '../../utils/IdsRegistryContext';
import { getName } from '../../utils/VueToJSX';
import Popover from '../popover/Popover';
import HeadingLevelProvider from '../heading/HeadingLevelProvider';

import { emitSchema, POPOVER_DIALOG_PROP_KEYS } from './constants';
import type { PopoverDialogProps } from './types';

/**
 * Renders the core Popover as a dialog, resolving its `aria-labelledby` from the ids registry.
 *
 * Owns the dialog logic (aria role/name, focus trap, close behavior) and must render as a descendant
 * of the `IdsRegistryProvider` set up by `PopoverDialog` - the subscription composable needs to run
 * below the provider. Internal to the popover-dialog family - not exported from the package barrel.
 */
const PopoverDialogContent = defineComponent(
    (props: PopoverDialogProps, { emit, slots, attrs }) => {
        const className = useClassName(() => props.class);

        // Vue normalizes hyphenated prop names to camelCase, so 'aria-label' prop becomes 'ariaLabel'.
        const ariaLabel = computed(() => props.label ?? (props as any).ariaLabel);
        const ariaLabelledBy = computed(() => (props as any).ariaLabelledby);

        const handleClose = () => emit('close');

        const labelId = useRegisteredId(DIALOG_LABEL_KEY);
        const accessibleNameProps = computed(() =>
            resolveAccessibleNameProps(ariaLabel.value, ariaLabelledBy.value || labelId.value),
        );

        return () => {
            const { label: _label, class: _class, ...rest } = props;
            // Vue normalizes hyphenated prop names to camelCase (see comment above), so 'aria-label' /
            // 'aria-labelledby' must be stripped by their normalized keys, not the hyphenated ones, or
            // they'd leak into forwardedProps and get rendered as-is alongside the resolved value.
            const {
                ariaLabel: _ariaLabel,
                ariaLabelledby: _ariaLabelledby,
                ...forwardedProps
            } = rest as typeof rest & {
                ariaLabel?: string;
                ariaLabelledby?: string;
            };

            return (
                <Popover
                    {...forwardedProps}
                    {...mergeProps(attrs, {
                        role: 'dialog',
                        'aria-modal': 'true',
                        ...accessibleNameProps.value,
                    })}
                    class={classNames.join(CLASSNAME, className.value)}
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
        name: getName('PopoverDialogContent'),
        inheritAttrs: false,
        props: POPOVER_DIALOG_PROP_KEYS,
        emits: emitSchema,
    },
);

export default PopoverDialogContent;
