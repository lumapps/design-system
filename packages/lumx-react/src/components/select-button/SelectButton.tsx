import React, { ElementType, useCallback, useState } from 'react';

import { mdiMenuDown } from '@lumx/icons';
import { findOptionById } from '@lumx/core/js/utils/select/findOptionById';
import type { NamedProps } from '@lumx/core/js/types';
import { SelectButton as UI, type SelectButtonProps as UIProps } from '@lumx/core/js/components/SelectButton';
import { type ComboboxButtonLabelDisplayMode } from '@lumx/core/js/components/Combobox/ComboboxButton';
import { type SelectButtonTranslations, type SelectTextFieldStatus } from '@lumx/core/js/utils/select/types';
import { ComponentRef, HasPolymorphicAs, HasRequiredLinkHref } from '@lumx/react/utils/type';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { Button, type ButtonProps } from '../button';
import { Combobox, type ComboboxPopoverProps } from '../combobox';

/**
 * Default trigger: LumX `Button` with the dropdown chevron pre-applied.
 * Used when no `as` prop is provided. Consumer-supplied `rightIcon` overrides
 * the default chevron (props are spread after).
 */
const DefaultSelectButtonTrigger = forwardRef<ButtonProps, HTMLButtonElement>((props, ref) => (
    <Button rightIcon={mdiMenuDown} {...props} ref={ref} />
));
DefaultSelectButtonTrigger.displayName = 'SelectButtonDefaultTrigger';
import { wrapRenderOption } from '../combobox/wrapRenderOption';
import { InfiniteScroll } from '../../utils/InfiniteScroll';

/** Keys controlled internally by SelectButton — omitted from forwarded element props. */
type OmittedKeys =
    | 'value'
    | 'children'
    | 'role'
    | 'aria-controls'
    | 'aria-haspopup'
    | 'aria-expanded'
    | 'aria-activedescendant'
    | keyof SelectButtonSelectProps<unknown>
    | 'label'
    | 'popoverProps'
    | 'labelDisplayMode'
    | 'listStatus'
    | 'translations'
    | 'onOpen'
    | 'ref';

/**
 * Named LumX ButtonProps at the top level — uses `NamedProps` to strip `GenericProps`'s
 * index signature so TypeScript can infer `O` from `options` / `getOptionId`.
 * Always available regardless of `as`.
 */
type SelectButtonCustomButtonProps = NamedProps<Omit<ButtonProps, OmittedKeys>>;

/**
 * Select-specific props typed over the option type O.
 * Kept as a standalone clean type (no index signature) so TypeScript can reliably infer O.
 */
type SelectButtonSelectProps<O> = Omit<ReactToJSX<UIProps<O>>, 'renderOption'> & {
    /** Callback on option selected */
    onChange?: (newValue?: O) => void;
    /** Callback to load more items */
    onLoadMore?: () => void;
    /** Callback fired when the dropdown open state changes. */
    onOpen?: (isOpen: boolean) => void;
    /**
     * Custom option render function. Must return a `<Combobox.Option>` element with custom
     * children/props. Core-computed props (`value`, `isSelected`, `description`, `key`) are
     * merged in automatically — the consumer does not need to forward them.
     */
    renderOption?: (option: O, index: number) => React.ReactNode;
};

/**
 * SelectButton props.
 *
 * Polymorphic component — use `as` to render the trigger as a different element or component
 * (e.g., `as="a"`, `as={RouterLink}`). Defaults to `'button'` for types (renders the LumX
 * `Button` component at runtime when `as` is not specified).
 *
 * The default `E = 'button'` avoids the `GenericProps` index signature that `typeof Button`
 * would introduce, which prevents TypeScript from inferring the option type `O`.
 * LumX-specific button props (emphasis, size, leftIcon, etc.) are always available via
 * `SelectButtonCustomButtonProps`.
 */
export type SelectButtonProps<O, E extends ElementType = 'button'> = SelectButtonSelectProps<O> &
    SelectButtonCustomButtonProps &
    Omit<HasPolymorphicAs<E>, OmittedKeys | keyof SelectButtonCustomButtonProps> &
    HasRequiredLinkHref<E> & {
        /** Button label (used for ARIA and when no selection) */
        label: string;
        /** Props passed to the Combobox.Popover */
        popoverProps?: ComboboxPopoverProps;
        /** Controls how the label/value is displayed in the button. */
        labelDisplayMode?: ComboboxButtonLabelDisplayMode;
        /**
         * Status of the dropdown list.
         * @default 'idle'
         */
        listStatus?: SelectTextFieldStatus;
        /** Optional translations for screen-reader announcements (loading/empty/error/option count). */
        translations?: SelectButtonTranslations;
        /** Ref for the button element. Type follows `as`. */
        ref?: ComponentRef<E>;
    };

/**
 * A Button with a select dropdown to choose between a list of options.
 * Polymorphic — use `as` to render the trigger as a different element or component.
 */
export const SelectButton = <O, E extends ElementType = 'button'>(props: SelectButtonProps<O, E>) => {
    const {
        options,
        getOptionId,
        getOptionName,
        getOptionDescription,
        renderOption,
        getSectionId,
        renderSectionTitle,
        value,
        onChange,
        onLoadMore,
        onOpen,
        label,
        popoverProps,
        labelDisplayMode,
        listStatus,
        translations,
        as,
        ref,
        ...buttonProps
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = props as any;
    const [listElement, setListElement] = useState<HTMLElement | null>(null);

    // Wrap the consumer's renderOption to inject core-computed props
    // (`value`, `isSelected`, `description`, `key`) into the returned <Combobox.Option>.
    const wrappedRenderOption = wrapRenderOption(renderOption);

    // Map option id selection to option object selection
    const handleSelect = useCallback(
        (selectedOption: { value: string }) => {
            const newValue = findOptionById(options, getOptionId, selectedOption?.value);
            onChange?.(newValue);
        },
        [getOptionId, onChange, options],
    );

    return UI(
        {
            options,
            getOptionId,
            getOptionName,
            getOptionDescription,
            renderOption: wrappedRenderOption,
            getSectionId,
            renderSectionTitle,
            value,
            label,
            labelDisplayMode,
            // Default trigger applies the dropdown chevron via `DefaultSelectButtonTrigger`.
            // When `as` is provided, no chevron is injected — caller controls trailing affordance.
            buttonProps: { ...buttonProps, as: as ?? DefaultSelectButtonTrigger, ref },
            popoverProps,
            listProps: { ref: setListElement },
            handleSelect,
            listStatus,
            onOpen,
            translations,
            onLoadMore,
            infiniteScrollOptions: { root: listElement, rootMargin: '100px' },
        },
        { Combobox, InfiniteScroll },
    );
};

SelectButton.displayName = 'SelectButton';
