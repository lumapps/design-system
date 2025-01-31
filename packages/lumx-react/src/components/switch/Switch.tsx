import React, { Children, InputHTMLAttributes, SyntheticEvent } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { Alignment, InputHelper, InputLabel, Theme } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { useId } from '@lumx/react/hooks/useId';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface SwitchProps extends GenericProps, HasTheme {
    /** Helper text. */
    helper?: string;
    /** Whether it is checked or not. */
    isChecked?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Native input name property. */
    name?: string;
    /** Position of the switch relative to the label. */
    position?: Extract<Alignment, 'right' | 'left'>;
    /** Native input value property. */
    value?: string;
    /** On change callback. */
    onChange?(isChecked: boolean, value?: string, name?: string, event?: SyntheticEvent): void;
    /** optional props for input */
    inputProps?: InputHTMLAttributes<HTMLInputElement>;
    /** Children */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Switch';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<SwitchProps> = {
    position: Alignment.left,
};

/**
 * Switch component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Switch = forwardRef<SwitchProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        checked,
        children,
        className,
        disabled,
        helper,
        id,
        isChecked = checked,
        isDisabled = disabled,
        name,
        onChange,
        position,
        theme = defaultTheme,
        value,
        inputProps = {},
        ...forwardedProps
    } = props;
    const generatedInputId = useId();
    const inputId = id || generatedInputId;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(!isChecked, value, name, event);
        }
    };

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    isChecked,
                    isDisabled,
                    position,
                    theme,
                    isUnchecked: !isChecked,
                }),
            )}
            aria-disabled={isDisabled}
        >
            <div className={`${CLASSNAME}__input-wrapper`}>
                <input
                    type="checkbox"
                    role="switch"
                    id={inputId}
                    className={`${CLASSNAME}__input-native`}
                    name={name}
                    value={value}
                    disabled={isDisabled}
                    checked={isChecked}
                    aria-checked={Boolean(isChecked)}
                    onChange={handleChange}
                    aria-describedby={helper ? `${inputId}-helper` : undefined}
                    {...inputProps}
                />

                <div className={`${CLASSNAME}__input-placeholder`}>
                    <div className={`${CLASSNAME}__input-background`} />
                    <div className={`${CLASSNAME}__input-indicator`} />
                </div>
            </div>

            {Children.count(children) > 0 && (
                <div className={`${CLASSNAME}__content`}>
                    <InputLabel htmlFor={inputId} theme={theme} className={`${CLASSNAME}__label`}>
                        {children}
                    </InputLabel>
                    {!isEmpty(helper) && (
                        <InputHelper id={`${inputId}-helper`} theme={theme} className={`${CLASSNAME}__helper`}>
                            {helper}
                        </InputHelper>
                    )}
                </div>
            )}
        </div>
    );
});
Switch.displayName = COMPONENT_NAME;
Switch.className = CLASSNAME;
Switch.defaultProps = DEFAULT_PROPS;
