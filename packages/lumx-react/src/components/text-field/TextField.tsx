import { ReactNode, Ref, RefObject, SyntheticEvent, useRef, useState } from 'react';

import { IconButton, IconButtonProps, InputLabelProps, Theme } from '@lumx/react';
import { GenericProps, HasTheme, HasAriaDisabled } from '@lumx/react/utils/type';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { useId } from '@lumx/react/hooks/useId';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';

import { CLASSNAME, COMPONENT_NAME } from '@lumx/core/js/components/TextField/constants';

import { TextField as UI, generateAccessibilityIds } from '@lumx/core/js/components/TextField/TextField';
import { RawInputText } from './RawInputText';
import { RawInputTextarea } from './RawInputTextarea';

/**
 * Defines the props of the component.
 */
export interface TextFieldProps extends GenericProps, HasTheme, HasAriaDisabled {
    /** Chip Group to be rendered before the main text input. */
    chips?: ReactNode;
    /** Props to pass to the clear button (minus those already set by the TextField props). If not specified, the button won't be displayed. */
    clearButtonProps?: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis'>;
    /** Error message. */
    error?: string | ReactNode;
    /** Whether we force the focus style or not. */
    forceFocusStyle?: boolean;
    /** Whether the text field is displayed with error style or not. */
    hasError?: boolean;
    /** Additional element to put at the end of the text field. */
    afterElement?: ReactNode;
    /** Helper text. */
    helper?: string | ReactNode;
    /** Icon (SVG path). */
    icon?: string;
    /** Native input id property (generated if not provided to link the label element). */
    id?: string;
    /** Reference to the <input> or <textarea> element. */
    inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement>;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Whether the component is required or not. */
    isRequired?: boolean;
    /** Whether the text field is displayed with valid style or not. */
    isValid?: boolean;
    /** Label text. */
    label?: string;
    /** Additional label props. */
    labelProps?: InputLabelProps;
    /** Max string length the input accepts (constrains the input and displays a character counter). */
    maxLength?: number;
    /** Minimum number of rows displayed in multiline mode (requires `multiline` to be enabled). */
    minimumRows?: number;
    /** Whether the text field is a textarea or an input. */
    multiline?: boolean;
    /** Native input name property. */
    name?: string;
    /** Placeholder text. */
    placeholder?: string;
    /** Reference to the wrapper. */
    textFieldRef?: Ref<HTMLDivElement>;
    /** Native input type (only when `multiline` is disabled). */
    type?: React.ComponentProps<'input'>['type'];
    /** Value. */
    value?: string;
    /** On blur callback. */
    onBlur?(event: React.FocusEvent): void;
    /** On change callback. */
    onChange(value: string, name?: string, event?: SyntheticEvent): void;
    /** On clear callback. */
    onClear?(event?: SyntheticEvent): void;
    /** On focus callback. */
    onFocus?(event: React.FocusEvent): void;
}

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<TextFieldProps> = {
    type: 'text',
};

/**
 * TextField component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TextField = forwardRef<TextFieldProps, HTMLDivElement>((props, ref) => {
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const defaultTheme = useTheme() || Theme.light;
    const {
        clearButtonProps,
        error,
        forceFocusStyle,
        hasError,
        helper,
        id,
        inputRef: inputRefProps,
        isRequired,
        maxLength,
        minimumRows,
        multiline,
        name,
        onBlur,
        onChange,
        onClear,
        onFocus,
        placeholder,
        textFieldRef,
        theme = defaultTheme,
        type = DEFAULT_PROPS.type,
        value,
        afterElement,
        ...forwardedProps
    } = otherProps;
    const generatedTextFieldId = useId();
    const textFieldId = id || generatedTextFieldId;
    /** Keep a clean local input ref to manage focus */
    const localInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
    /** Merge prop input ref and local input ref */
    const inputRef = mergeRefs(localInputRef, inputRefProps);

    const { helperId, errorId, describedById } = generateAccessibilityIds(
        helper,
        error,
        generatedTextFieldId,
        forwardedProps['aria-describedby'],
    );

    const [isFocus, setFocus] = useState(false);

    /**
     * Function triggered when the Clear Button is clicked.
     * The idea is to execute the `onChange` callback with an empty string
     * and remove focus from the clear button.
     * @param evt On clear event.
     */
    const handleClear = (evt?: React.MouseEvent) => {
        evt?.nativeEvent.preventDefault();
        evt?.nativeEvent.stopPropagation();
        (evt?.currentTarget as HTMLElement).blur();

        onChange('');

        if (onClear) {
            onClear(evt);
        }

        /** Use local inputRef in case the prop input ref is a `mergeRefs` function. */
        const inputElement = localInputRef as RefObject<HTMLInputElement | HTMLTextAreaElement>;

        if (inputElement && inputElement.current) {
            inputElement.current.focus();
        }
    };

    const inputProps = {
        id: textFieldId,
        ref: inputRef as any,
        ...disabledStateProps,
        ...forwardedProps,
        required: isRequired,
        maxLength,
        onBlur(evt: React.FocusEvent) {
            setFocus(false);
            onBlur?.(evt);
        },
        onFocus(evt: React.FocusEvent) {
            setFocus(true);
            onFocus?.(evt);
        },
        placeholder,
        value,
        onChange,
        name,
        'aria-invalid': hasError || undefined,
        'aria-describedby': describedById,
        readOnly: forwardedProps.readOnly || disabledStateProps['aria-disabled'],
        theme,
    };
    const input = multiline ? (
        <RawInputTextarea {...inputProps} minimumRows={minimumRows} />
    ) : (
        <RawInputText type={type} {...inputProps} />
    );

    return UI({
        ref,
        isAnyDisabled,
        input,
        id: textFieldId,
        afterElement,
        hasError,
        helperId,
        multiline,
        maxLength,
        isRequired,
        errorId,
        placeholder,
        textFieldRef,
        value,
        theme,
        error,
        helper,
        IconButton: IconButton as any,
        isFocus,
        ...forwardedProps,
        clearButtonProps: {
            ...clearButtonProps,
            onClick: handleClear,
        },
    });
});
TextField.displayName = COMPONENT_NAME;
TextField.className = CLASSNAME;
TextField.defaultProps = DEFAULT_PROPS;
