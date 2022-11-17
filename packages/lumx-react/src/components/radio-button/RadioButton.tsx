import React, { useMemo, forwardRef, ReactNode, SyntheticEvent, InputHTMLAttributes } from 'react';

import classNames from 'classnames';
import { uid } from 'uid';

import { InputHelper, InputLabel, Theme } from '@lumx/react';

import { Comp, GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';

/**
 * Defines the props of the component.
 */
export interface RadioButtonProps extends GenericProps, HasTheme {
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
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<RadioButtonProps> = {
    theme: Theme.light,
};

/**
 * RadioButton component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const RadioButton: Comp<RadioButtonProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        checked,
        className,
        disabled,
        helper,
        id,
        inputRef,
        isChecked = checked,
        isDisabled = disabled,
        label,
        name,
        onChange,
        theme,
        value,
        inputProps,
        ...forwardedProps
    } = props;
    const inputId = useMemo(() => id || `${CLASSNAME.toLowerCase()}-${uid()}`, [id]);

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
                    isDisabled,
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
                    disabled={isDisabled}
                    id={inputId}
                    tabIndex={isDisabled ? -1 : 0}
                    type="radio"
                    name={name}
                    value={value}
                    checked={isChecked}
                    onChange={handleChange}
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
