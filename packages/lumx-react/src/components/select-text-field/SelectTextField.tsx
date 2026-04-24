import React, { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';

import type { ChipProps } from '@lumx/core/js/components/Chip';
import { getWithSelector } from '@lumx/core/js/utils/selectors';
import { type BaseSelectTextFieldWrapperProps } from '@lumx/core/js/utils/select/types';
import { getOptionDisplayName } from '@lumx/core/js/utils/select/getOptionDisplayName';
import { findOptionById } from '@lumx/core/js/utils/select/findOptionById';
import { SelectTextField as UI } from '@lumx/core/js/components/SelectTextField';
import { HasClassName } from '@lumx/react/utils/type';
import { Combobox, type ComboboxPopoverProps } from '../combobox';
import { wrapRenderOption } from '../combobox/wrapRenderOption';
import { InfiniteScroll } from '../../utils/InfiniteScroll';
import { useMergeRefs } from '../../utils/react/mergeRefs';
import { SelectionChipGroup } from '../chip/SelectionChipGroup';

interface BaseSelectTextFieldProps<O = any> extends BaseSelectTextFieldWrapperProps<O>, HasClassName {
    /**
     * Custom option render function. Must return a `<Combobox.Option>` element with custom
     * children/props. Core-computed props (`value`, `isSelected`, `description`, `key`) are
     * merged in automatically — the consumer does not need to forward them.
     */
    renderOption?: (option: O, index: number) => React.ReactNode;
    /**
     * Custom section title render function. Receives the section id and the options
     * in that section. Returns custom JSX to display as the section header.
     * When not provided, the section id is used as a plain text label.
     */
    renderSectionTitle?: (sectionId: string, options: O[]) => React.ReactNode;
    /**
     * Callback fired when the search input text changes.
     * Independent of `filter`: both can be used together (e.g. client-side
     * filtering + tracking search text for a "create" action).
     */
    onSearch?: (searchText: string) => void;
    /** Ref to the underlying input element. */
    inputRef?: React.Ref<HTMLInputElement>;
    /** Callback to load more items (infinite scroll). */
    onLoadMore?: () => void;
    /** Content to render before the options list. */
    beforeOptions?: React.ReactNode;
    /** Props forwarded to the Combobox.List popover. */
    popoverProps?: ComboboxPopoverProps;
    /** On blur callback. */
    onBlur?: (event: React.FocusEvent) => void;
    /** On focus callback. */
    onFocus?: (event: React.FocusEvent) => void;
    /** On key down callback. */
    onKeyDown?: (event: React.KeyboardEvent) => void;
    /** On clear callback (fired when the clear button is clicked). */
    onClear?: (event?: SyntheticEvent) => void;
    /** Callback fired when the dropdown open state changes. */
    onOpen?: (isOpen: boolean) => void;
}

/** Single selection props **/
export interface SingleSelectTextFieldProps<O = any> extends BaseSelectTextFieldProps<O> {
    /** Selection type. */
    selectionType: 'single';
    /** Selected option object. */
    value?: O;
    /** Callback on option selected (or cleared). */
    onChange?: (newValue?: O) => void;
    /** Not available in single selection. */
    renderChip?: never;
}

/** Multiple selection props **/
export interface MultipleSelectTextFieldProps<O = any> extends BaseSelectTextFieldProps<O> {
    /** Selection type. */
    selectionType: 'multiple';
    /** Selected option objects. */
    value?: O[];
    /** Callback on option array changed. */
    onChange?: (newValue?: O[]) => void;
    /** Custom chip render function. */
    renderChip?: (option: O) => React.ReactNode;
    /** Customize chip props per selected option. */
    getChipProps?: (option: O) => Partial<ChipProps>;
}

/**
 * SelectTextField props — supports both single and multiple selection.
 */
export type SelectTextFieldProps<O = any> = SingleSelectTextFieldProps<O> | MultipleSelectTextFieldProps<O>;

/**
 * A text field with a select dropdown to choose between a list of options.
 * Supports search/filter, single selection, and multiple selection with chips.
 */
export const SelectTextField = <O,>(props: SelectTextFieldProps<O>) => {
    const {
        // Options
        options,
        getOptionId,
        getOptionName,
        getOptionDescription,
        renderOption,
        getSectionId,
        renderSectionTitle,
        // Selection
        selectionType,
        value,
        onChange,
        // Search / filter
        filter,
        openOnFocus,
        onSearch,
        searchInputValue: externalSearchValue,
        // Clear
        hasClearButton = true,
        // Status
        listStatus = 'idle',
        // Text field
        className,
        label,
        placeholder,
        icon,
        isDisabled,
        'aria-disabled': ariaDisabled,
        isRequired,
        hasError,
        error,
        helper,
        id,
        name,
        isValid,
        maxLength,
        ariaLabel,
        inputRef: externalInputRef,
        // Event callbacks
        onBlur: externalOnBlur,
        onFocus,
        onKeyDown,
        onClear: externalOnClear,
        onOpen,
        // Forwarding
        inputProps: consumerInputProps,
        // Load more
        onLoadMore,
        beforeOptions,
        // Popover
        popoverProps,
        // Theme
        theme,
        // Translations
        translations,
    } = props;

    const isAnyDisabled = !!isDisabled || ariaDisabled === true || ariaDisabled === 'true';
    const isMultiple = selectionType === 'multiple';
    const renderChip = isMultiple ? (props as MultipleSelectTextFieldProps<O>).renderChip : undefined;
    const getChipProps = isMultiple ? (props as MultipleSelectTextFieldProps<O>).getChipProps : undefined;

    // Wrap the consumer's renderOption to inject core-computed props
    // (`value`, `isSelected`, `description`, `key`) into the returned <Combobox.Option>.
    const wrappedRenderOption = wrapRenderOption(renderOption);

    const [listElement, setListElement] = useState<HTMLElement | null>(null);
    const localInputRef = useRef<HTMLInputElement>(null);
    const mergedInputRef = useMergeRefs(localInputRef, externalInputRef);

    // Track whether the user is actively typing a search.
    const [isSearching, setIsSearching] = useState(() => Boolean(externalSearchValue));
    const [searchText, setSearchText] = useState(() => externalSearchValue ?? '');

    /* Sync external controlled search value into internal state when it changes.
     * This allows the parent to seed or reset the visible search text
     * (e.g., setting searchInputValue='' after creating an entry from beforeOptions). */
    useEffect(() => {
        if (externalSearchValue !== undefined) {
            setSearchText(externalSearchValue);
            setIsSearching(Boolean(externalSearchValue));
        }
    }, [externalSearchValue]);

    // The displayed value shown in the input
    let displayValue;
    if (isMultiple || isSearching) {
        displayValue = searchText;
    } else if (!isMultiple) {
        displayValue = getOptionDisplayName(value as O | undefined, getOptionName, getOptionId);
    }

    // Map option id selection to option object selection.
    const handleSelect = useCallback(
        (selectedOption: { value: string }) => {
            const selectedValue = selectedOption.value;
            const newOption = findOptionById(options, getOptionId, selectedValue);

            if (!isMultiple) {
                onChange?.(newOption as any);
            } else {
                const currentValue = (value as any[]) || [];
                const existingIndex = currentValue.findIndex(
                    (item) => getWithSelector(getOptionId, item) === selectedValue,
                );

                if (existingIndex === -1) {
                    // Skip if no matching option found (e.g. beforeOptions custom actions).
                    if (newOption) {
                        onChange?.([...currentValue, newOption] as any);
                    }
                } else {
                    // Remove option (toggle off)
                    const updated = [...currentValue];
                    updated.splice(existingIndex, 1);
                    onChange?.(updated as any);
                }
            }

            // Reset search state after selection.
            setIsSearching(false);
            setSearchText('');
            onSearch?.('');
        },
        [getOptionId, isMultiple, onChange, onSearch, options, value],
    );

    // Handle text input changes (search).
    const handleInputChange = useCallback(
        (inputValue: string) => {
            setIsSearching(true);
            setSearchText(inputValue);
            onSearch?.(inputValue);

            // When the user clears the input (single mode only), clear the selection too.
            if (!isMultiple && inputValue === '' && value !== undefined && value !== null) {
                (onChange as ((newValue?: O) => void) | undefined)?.(undefined);
            }
        },
        [isMultiple, onChange, onSearch, value],
    );

    // Handle clear button click (single mode only).
    const handleClear = useCallback(
        (event?: SyntheticEvent) => {
            // Prevent the clear event from being handled as a regular input change.
            event?.stopPropagation();
            (onChange as ((newValue?: O) => void) | undefined)?.(undefined);
            setIsSearching(false);
            setSearchText('');
            onSearch?.('');
            externalOnClear?.(event);
        },
        [onChange, onSearch, externalOnClear],
    );

    // Handle blur: reset input to selected value name, then call consumer's onBlur.
    const handleBlur = useCallback(
        (event?: React.FocusEvent) => {
            setIsSearching(false);
            setSearchText('');
            onSearch?.('');
            externalOnBlur?.(event as React.FocusEvent);
        },
        [externalOnBlur, onSearch],
    );

    const showClear = !isMultiple && !isAnyDisabled && hasClearButton && value !== undefined && value !== null;

    const chips = isMultiple ? (
        <SelectionChipGroup
            value={value as O[] | undefined}
            theme={theme}
            getOptionId={getOptionId}
            getOptionName={getOptionName}
            onChange={onChange as ((newValue?: O[]) => void) | undefined}
            inputRef={localInputRef as React.RefObject<HTMLInputElement>}
            isDisabled={isAnyDisabled}
            label={translations.chipGroupLabel ?? label}
            chipRemoveLabel={translations.chipRemoveLabel}
            renderChip={renderChip}
            getChipProps={getChipProps}
        />
    ) : undefined;

    // The core template is not generic, so we cast selectors when forwarding to UI().
    return UI(
        {
            options,
            getOptionId: getOptionId as any,
            getOptionName: getOptionName as any,
            getOptionDescription: getOptionDescription as any,
            renderOption: wrappedRenderOption,
            getSectionId: getSectionId as any,
            renderSectionTitle: renderSectionTitle as any,
            selected: value,
            label,
            isMultiselectable: isMultiple,
            listStatus,
            onOpen,
            loadingMessage: translations.loadingMessage,
            emptyMessage: translations.emptyMessage,
            nbOptionMessage: translations.nbOptionMessage,
            errorMessage: translations.errorMessage,
            errorTryReloadMessage: translations.errorTryReloadMessage,
            inputProps: {
                ...consumerInputProps,
                placeholder,
                icon,
                value: displayValue,
                onChange: handleInputChange,
                onSelect: handleSelect,
                onBlur: handleBlur,
                onFocus,
                onKeyDown,
                inputRef: mergedInputRef,
                isDisabled,
                'aria-disabled': ariaDisabled,
                isRequired,
                hasError,
                error,
                helper,
                id,
                name,
                isValid,
                maxLength,
                'aria-label': ariaLabel,
                clearButtonProps: showClear ? { label: translations.clearLabel } : undefined,
                onClear: handleClear,
                toggleButtonProps: translations.showSuggestionsLabel
                    ? { label: translations.showSuggestionsLabel }
                    : undefined,
                filter,
                openOnFocus,
                className,
                theme,
            },
            popoverProps,
            listProps: { ref: setListElement },
            chips,
            beforeOptions,
            onLoadMore,
            infiniteScrollOptions: { root: listElement, rootMargin: '100px' },
        },
        { Combobox, InfiniteScroll },
    );
};

SelectTextField.displayName = 'SelectTextField';
