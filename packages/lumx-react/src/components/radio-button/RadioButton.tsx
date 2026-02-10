import { Theme } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import {
    RadioButton as UI,
    RadioButtonProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/RadioButton';
import { useId } from '@lumx/react/hooks/useId';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';

/**
 * Defines the props of the component.
 */
export interface RadioButtonProps extends GenericProps, Omit<UIProps, 'inputId'> {}

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

    return UI({
        ref,
        className,
        helper,
        inputRef,
        isChecked,
        label,
        name,
        onChange,
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
