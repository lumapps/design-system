import { ElementType, useEffect, useRef } from 'react';

import { setupComboboxButton } from '@lumx/core/js/components/Combobox/setupComboboxButton';
import {
    ComboboxButton as UI,
    ComboboxButtonProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxButton';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { forwardRefPolymorphic } from '@lumx/react/utils/react/forwardRefPolymorphic';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { ComponentRef, HasPolymorphicAs, HasRequiredLinkHref } from '@lumx/react/utils/type';
import { Tooltip } from '../tooltip';
import { Button } from '../button';
import { useComboboxContext } from './context/ComboboxContext';
import { useComboboxOpen } from './context/useComboboxOpen';

/**
 * Props for Combobox.Button component.
 *
 * Polymorphic component — use `as` to render the trigger as a different element or component
 * (e.g., `as="a"`, `as={RouterLink}`). Defaults to the LumX `Button` component.
 */
export type ComboboxButtonProps<E extends ElementType = typeof Button> = Omit<
    HasPolymorphicAs<E>,
    'children' | 'role' | 'aria-controls' | 'aria-haspopup' | 'aria-expanded' | 'aria-activedescendant'
> &
    HasRequiredLinkHref<E> &
    ReactToJSX<UIProps>;

/**
 * Combobox.Button component - Button trigger for select-only combobox mode.
 *
 * Renders a button with proper ARIA attributes. Registers itself as the
 * combobox trigger on mount for keyboard navigation and typeahead.
 * Polymorphic — use `as` to change the rendered element or component.
 *
 * @param props Component props.
 * @param ref   Component ref.
 * @return React element.
 */
export const ComboboxButton = Object.assign(
    forwardRefPolymorphic(
        <E extends ElementType = typeof Button>(props: ComboboxButtonProps<E>, ref: ComponentRef<E>) => {
            const { listboxId, anchorRef, setHandle } = useComboboxContext();
            const [isOpen] = useComboboxOpen();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { as, label, value, labelDisplayMode = 'show-selection', onSelect, ...buttonProps } = props as any;

            // If `as` is provided, use it directly; otherwise use the LumX Button (full theme/disabled behavior).
            const ButtonComp = as ?? Button;

            const internalRef = useRef<HTMLButtonElement>(null);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mergedRef = useMergeRefs(ref as any, internalRef, anchorRef as any);

            // Keep onSelect in a ref to avoid re-creating the handle on every render
            const onSelectRef = useRef(onSelect);
            onSelectRef.current = onSelect;

            // Create the combobox handle with button-mode controller on mount
            useEffect(() => {
                const button = internalRef.current;
                if (!button) return undefined;
                const handle = setupComboboxButton(button, {
                    onSelect(option) {
                        onSelectRef.current?.(option);
                    },
                });
                setHandle(handle);
                return () => {
                    handle.destroy();
                    setHandle(null);
                };
            }, [setHandle]);

            return UI(
                {
                    ...buttonProps,
                    label,
                    value,
                    labelDisplayMode,
                    listboxId,
                    isOpen,
                    ref: mergedRef,
                },
                { Button: ButtonComp, Tooltip },
            );
        },
    ),
    { displayName: COMPONENT_NAME, className: CLASSNAME },
);
