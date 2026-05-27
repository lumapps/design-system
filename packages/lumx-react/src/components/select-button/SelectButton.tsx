import React, { ElementType, type ForwardedRef, useCallback, useState } from 'react';

import { mdiMenuDown } from '@lumx/icons';
import { toggleSelection } from '@lumx/core/js/utils/select/toggleSelection';
import type { GenericProps, NamedProps } from '@lumx/core/js/types';
import { SelectButton as UI, type SelectButtonProps as UIProps } from '@lumx/core/js/components/SelectButton';
import { type ComboboxButtonLabelDisplayMode } from '@lumx/core/js/components/Combobox/ComboboxButton';
import { type SelectButtonTranslations, type SelectListStatus } from '@lumx/core/js/utils/select/types';
import { ComponentRef } from '@lumx/react/utils/type';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { Button, type ButtonProps } from '../button';
import { Combobox, type ComboboxPopoverProps } from '../combobox';
import { wrapRenderOption } from '../combobox/wrapRenderOption';
import { InfiniteScroll } from '../../utils/InfiniteScroll';

/** Default trigger: LumX `Button` with the dropdown chevron pre-applied. */
const DefaultButton = forwardRef<ButtonProps, HTMLButtonElement>((props, ref) => (
    <Button rightIcon={mdiMenuDown} {...props} ref={ref} />
));

/** Keys managed internally — never forwarded to the trigger element. */
type OmittedKeys =
    | 'value'
    | 'children'
    | 'role'
    | 'aria-controls'
    | 'aria-haspopup'
    | 'aria-expanded'
    | 'aria-activedescendant'
    | 'ref';

/** Select-specific props common to both single and multi modes. */
type SelectButtonSelectProps<O> = Omit<
    ReactToJSX<UIProps<O>>,
    'renderOption' | 'buttonProps' | 'value' | 'isMultiselectable'
> & {
    /** Called to load more options (infinite scroll). */
    onLoadMore?: () => void;
    /** Called when the dropdown opens or closes. */
    onOpen?: (isOpen: boolean) => void;
    /**
     * Custom option renderer. It should return a `<SelectButton.Option>`.
     * Props `value`, `isSelected`, `description` and `key` are merged in automatically.
     */
    renderOption?: (option: O, index: number) => React.ReactNode;
};

/**
 * Forwarded trigger props for a given element `E`, minus the keys that the
 * component manages internally.
 */
type TriggerProps<E extends ElementType> = Omit<NamedProps<React.ComponentProps<E>>, OmittedKeys>;

/**
 * Common base — Select-specific props plus the ARIA / label / popover layer.
 * `as`, `ref`, `selectionType`, `value`, `onChange` are intentionally hoisted
 * to the top-level `SelectButtonProps` shape (below) so that TS can infer
 * `O`, `E`, and `S` directly from those JSX attributes.
 */
type CommonSelectButtonProps<O> = SelectButtonSelectProps<O> &
    GenericProps & {
        /** Button label, used for ARIA and as fallback when no option is selected. */
        label: string;
        /** Props forwarded to the popover. */
        popoverProps?: ComboboxPopoverProps;
        /** How the selected option is shown in the trigger. */
        labelDisplayMode?: ComboboxButtonLabelDisplayMode;
        /**
         * Status of the dropdown list (loading, error, etc.).
         * @default 'idle'
         */
        listStatus?: SelectListStatus;
        /** Screen-reader translations (loading/empty/error/option count). */
        translations?: SelectButtonTranslations;
    };

/**
 * Props for `SelectButton`.
 *
 * Polymorphic — pass `as` to render the trigger as a different component
 * (e.g. `as={IconButton}`, `as={Chip}`, `as={Link}`). With no `as`, the trigger
 * is the LumX `Button` with the dropdown chevron, so LumX `ButtonProps`
 * (`emphasis`, `size`, `leftIcon`…) are accepted. With `as`, the trigger is
 * fully replaced and only props valid for that component apply.
 *
 * Discriminated on `selectionType`:
 * - default / `'single'` → `value?: O`, `onChange?: (newValue: O) => void`.
 * - `'multiple'`         → `value?: O[]`, `onChange?: (newValue: O[]) => void`.
 *
 * `as` and `selectionType` are top-level on this type (rather than buried in
 * an intersection or union member) so that TS can infer `E` from `as` and
 * `S` from `selectionType` without explicit generic annotations at the call site.
 *
 * @typeParam O - Option object type, inferred from `options` / `getOptionId`.
 * @typeParam E - Trigger element type, inferred from `as`. Defaults to the LumX `Button`.
 * @typeParam S - Selection mode, inferred from `selectionType`. Defaults to `'single'`.
 */
export type SelectButtonProps<
    O,
    E extends ElementType = typeof DefaultButton,
    S extends 'single' | 'multiple' = 'single',
> = CommonSelectButtonProps<O> &
    TriggerProps<E> & {
        /** Customize the rendered trigger component. Inference site for `E`. */
        as?: E;
        /** Ref for the trigger element. Type follows `as`. */
        ref?: ComponentRef<E>;
        /**
         * Selection mode discriminator. Inference site for `S`.
         * Optional — defaults to `'single'`. Set to `'multiple'` to opt into
         * multi-select; this also switches `value` / `onChange` to array form.
         */
        selectionType?: S;
        /** Selected option(s). Shape depends on `selectionType`. */
        value?: S extends 'multiple' ? O[] : O;
        /** Called when the selection changes. Shape depends on `selectionType`. */
        onChange?: S extends 'multiple' ? (newValue: O[]) => void : (newValue: O) => void;
    };

/**
 * Single-selection props (`selectionType` defaults to `'single'`).
 */
export type SingleSelectButtonProps<O, E extends ElementType = typeof DefaultButton> = NamedProps<
    SelectButtonProps<O, E, 'single'>
>;

/**
 * Multi-selection props (`selectionType: 'multiple'` is required to opt in).
 */
export type MultipleSelectButtonProps<O, E extends ElementType = typeof DefaultButton> = NamedProps<
    SelectButtonProps<O, E, 'multiple'>
>;

/**
 * `React.forwardRef` re-typed to preserve our polymorphic generics
 * `<O, E, S>` (which the stock `React.forwardRef` would erase).
 */
type ForwardRefSelectButton = (
    render: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        props: any,
        ref: ForwardedRef<unknown>,
    ) => React.ReactNode,
) => {
    <O, E extends ElementType = typeof DefaultButton, S extends 'single' | 'multiple' = 'single'>(
        props: SelectButtonProps<O, E, S>,
    ): React.ReactNode;
    displayName?: string;
};

/**
 * A button trigger with a dropdown to select an option (single mode) or
 * options (multi mode) from a list. Polymorphic — pass `as` to customize the trigger element.
 */
export const SelectButton = (React.forwardRef as ForwardRefSelectButton)((props, ref) => {
    const {
        options,
        getOptionId,
        getOptionName,
        getOptionDescription,
        renderOption,
        getSectionId,
        renderSectionTitle,
        selectionType,
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
        ...buttonProps
    } = props;
    const [listElement, setListElement] = useState<HTMLElement | null>(null);

    const isMultiple = selectionType === 'multiple';

    // Inject core-computed props into the consumer's renderOption result.
    const wrappedRenderOption = wrapRenderOption(renderOption);

    // Map the core's option-id selection back to the option object(s).
    const handleSelect = useCallback(
        (selectedOption: { value: string }) => {
            const next = toggleSelection(options, getOptionId, value, selectedOption?.value, isMultiple);
            onChange?.(next);
        },
        [getOptionId, isMultiple, onChange, options, value],
    );

    // If as is defined and not the Button, render as, else render DefaultButton (with mdiMenuDown right icon)
    const buttonAs = as && as !== Button ? as : DefaultButton;

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
            isMultiselectable: isMultiple,
            label,
            labelDisplayMode,
            buttonProps: { ...buttonProps, as: buttonAs, ref },
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
});

SelectButton.displayName = 'SelectButton';
