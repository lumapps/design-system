import { ReactNode, SyntheticEvent, InputHTMLAttributes } from 'react';

import classNames from 'classnames';

import { InputHelper, InputLabel, Theme } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/core/js/utils/className';
import type { LumxClassName } from '@lumx/core/js/types';
import { useId } from '@lumx/react/hooks/useId';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';
import { HasAriaDisabled } from '@lumx/react/utils/type/HasAriaDisabled';

/**
 * Defines the props of the component.
 */
export interface RadioButtonProps extends GenericProps, HasTheme, HasAriaDisabled {
    /** Helper text. */
    helper?: string;
    /** Native input id property. */
    id?: string;
    /** Native input ref. */
    inputRef?: React.Ref<HTMLInputElement>;
    /** Whether it is checked or not. */
    isChecked?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Label content. */
    label?: ReactNode;
    /** Native input name property. */
    name?: string;
    /** Native input value property. */
    value?: string;
    /** On change callback. */
    onChange?(value?: string, name?: string, event?: SyntheticEvent): void;
    /** optional props for input */
    inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'RadioButton';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-radio-button';

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
        inputProps,
        ...forwardedProps
    } = otherProps;
    const generatedInputId = useId();
    const inputId = id || generatedInputId;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(value, name, event);
        }
    };

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    isChecked,
                    isDisabled: isAnyDisabled,
                    isUnchecked: !isChecked,
                    prefix: CLASSNAME,
                    theme,
                }),
            )}
        >
            <div className={`${CLASSNAME}__input-wrapper`}>
                <input
                    ref={inputRef}
                    className={`${CLASSNAME}__input-native`}
                    {...disabledStateProps}
                    id={inputId}
                    type="radio"
                    name={name}
                    value={value}
                    checked={isChecked}
                    onChange={handleChange}
                    readOnly={inputProps?.readOnly || isAnyDisabled}
                    aria-describedby={helper ? `${inputId}-helper` : undefined}
                    {...inputProps}
                />

                <div className={`${CLASSNAME}__input-placeholder`}>
                    <div className={`${CLASSNAME}__input-background`} />
                    <div className={`${CLASSNAME}__input-indicator`} />
                </div>
            </div>

            <div className={`${CLASSNAME}__content`}>
                {label && (
                    <InputLabel htmlFor={inputId} theme={theme} className={`${CLASSNAME}__label`}>
                        {label}
                    </InputLabel>
                )}
                {helper && (
                    <InputHelper id={`${inputId}-helper`} theme={theme} className={`${CLASSNAME}__helper`}>
                        {helper}
                    </InputHelper>
                )}
            </div>
        </div>
    );
});
RadioButton.displayName = COMPONENT_NAME;
RadioButton.className = CLASSNAME;
RadioButton.defaultProps = DEFAULT_PROPS;
