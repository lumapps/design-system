import { useContext } from 'react';
import { Theme } from '@lumx/core/js/constants';
import type { GenericProps } from '@lumx/core/js/types';
import {
    RadioButton as UI,
    RadioButtonProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/RadioButton';
import { resolveRadioState } from '@lumx/core/js/components/RadioGroup/resolveRadioState';
import { useId } from '@lumx/react/hooks/useId';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { RadioGroupContext } from './RadioGroupContext';

/**
 * Defines the props of the component.
 */
export interface RadioButtonProps extends GenericProps, ReactToJSX<UIProps, 'inputId'> {
    /** On change callback. */
    onChange?(value?: string, name?: string, event?: React.ChangeEvent): void;
}

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<RadioButtonProps> = {};

/**
 * RadioButton component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const RadioButton = forwardRef<RadioButtonProps, HTMLDivElement>((props, ref) => {
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const defaultTheme = useTheme() || Theme.light;
    const group = useContext(RadioGroupContext);
    const {
        checked,
        className,
        helper,
        id,
        inputRef,
        isChecked = checked,
        label,
        name,
        onChange,
        theme = defaultTheme,
        value,
        inputProps = {},
        ...forwardedProps
    } = otherProps;
    const generatedInputId = useId();
    const inputId = id || generatedInputId;
    const { isChecked: resolvedIsChecked, name: resolvedName } = resolveRadioState({ isChecked, name, value }, group);

    const handleChange = (changeValue?: string, changeName?: string, event?: any) => {
        onChange?.(changeValue, changeName, event);
        if (changeValue !== undefined) group?.onChange?.(changeValue, changeName, event);
    };

    return UI({
        ref,
        className,
        helper,
        inputRef,
        isChecked: resolvedIsChecked,
        label,
        name: resolvedName,
        handleChange: isAnyDisabled ? undefined : handleChange,
        theme,
        value,
        inputProps: {
            ...inputProps,
            ...disabledStateProps,
            readOnly: inputProps.readOnly || disabledStateProps['aria-disabled'],
        },
        ...forwardedProps,
        isDisabled: isAnyDisabled,
        inputId,
    });
});
RadioButton.displayName = COMPONENT_NAME;
RadioButton.className = CLASSNAME;
RadioButton.defaultProps = DEFAULT_PROPS;
