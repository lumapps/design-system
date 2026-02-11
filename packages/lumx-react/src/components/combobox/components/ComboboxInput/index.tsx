import React from 'react';

import { mdiChevronDown, mdiChevronUp } from '@lumx/icons';
import { Emphasis, IconButton, Size, TextField, TextFieldProps } from '@lumx/react';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { PartialBy } from '@lumx/core/js/types';

import { useComboboxRefs } from '../../context/ComboboxRefsContext';
import { useCombobox } from '../../hooks/useCombobox';
import { useComboboxInput } from '../../hooks/useComboboxInput';

/**
 * All TextField props that are extended.
 * We can't use "Omit" here as it is not compatible with the "GenericProps" type from the DS,
 * meaning we would loose all props.
 *
 */
type ExtendedTextFieldProps = PartialBy<
    Pick<
        TextFieldProps,
        | 'ariaLabel'
        | 'chips'
        | 'error'
        | 'forceFocusStyle'
        | 'hasError'
        | 'afterElement'
        | 'helper'
        | 'icon'
        | 'inputRef'
        | 'textFieldRef'
        | 'isDisabled'
        | 'className'
        | 'isRequired'
        | 'isValid'
        | 'label'
        | 'maxLength'
        | 'minimumRows'
        | 'multiline'
        | 'id'
        | 'name'
        | 'placeholder'
        | 'onBlur'
        | 'onClear'
        | 'onKeyDown'
        | 'onFocus'
        | 'theme'
    >,
    'ariaLabel' | 'onKeyDown'
>;

export type ComboboxInputProps = ExtendedTextFieldProps & {
    /** Whether the toggle button should be hidden */
    hideToggle?: boolean;
    /** Activate the clear button */
    hasClearButton?: boolean;
    /** Clear button forwarded props */
    clearButtonProps?: Omit<TextFieldProps['clearButtonProps'], 'label'>;
    /** Make input read only */
    readOnly?: boolean;
};

/**
 * Combobox input trigger.
 *
 * @family Combobox
 */
export const ComboboxInput = ({
    hideToggle,
    inputRef,
    textFieldRef,
    afterElement,
    onFocus,
    onBlur,
    onKeyDown,
    clearButtonProps,
    hasClearButton,
    theme,
    ...textFieldProps
}: ComboboxInputProps) => {
    const refs = useComboboxRefs();
    const context = useCombobox();
    const inputProps = useComboboxInput({ refs, context, onBlur, onFocus, onKeyDown });
    const { listboxId, isOpen, handleOpen, handleClose, inputValue, handleInputChange } = context;

    /** Callback for when the toggle button is trigged */
    const handleManualToggle = () => {
        if (isOpen) {
            handleClose();
        } else {
            handleOpen({ manual: true });
        }
        refs.triggerRef?.current?.focus();
    };

    return (
        <TextField
            // Disable native autocomplete
            autoComplete="off"
            {...textFieldProps}
            inputRef={mergeRefs(refs.triggerRef as React.Ref<any>, inputRef)}
            textFieldRef={mergeRefs(refs.anchorRef as React.Ref<any>, textFieldRef)}
            // Combobox props
            {...inputProps}
            theme={theme}
            value={inputValue}
            onClear={() => handleInputChange('')}
            onChange={handleInputChange}
            clearButtonProps={
                hasClearButton ? { ...clearButtonProps, label: context.translations.clearLabel } : undefined
            }
            afterElement={
                (!hideToggle || afterElement) && (
                    <>
                        {afterElement}
                        {!hideToggle && (
                            <IconButton
                                theme={theme}
                                onClick={handleManualToggle}
                                label={context.translations.showSuggestionsLabel}
                                emphasis={Emphasis.low}
                                size={Size.s}
                                icon={inputProps['aria-expanded'] ? mdiChevronUp : mdiChevronDown}
                                type="button"
                                tabIndex={-1}
                                aria-expanded={inputProps['aria-expanded']}
                                aria-haspopup="listbox"
                                aria-controls={listboxId}
                            />
                        )}
                    </>
                )
            }
        />
    );
};
