import React, { useMemo, forwardRef, ReactNode, SyntheticEvent, InputHTMLAttributes } from 'react';

import classNames from 'classnames';
import { uid } from 'uid';

import { mdiCheck } from '@lumx/icons';

import { Icon, InputHelper, InputLabel, Theme } from '@lumx/react';
import { Comp, GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';

/**
 * Defines the props of the component.
 */
export interface CheckboxProps extends GenericProps, HasTheme {
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
    /** Label text. */
    label?: ReactNode;
    /** Native input name property. */
    name?: string;
    /** Native input value property. */
    value?: string;
    /** On change callback. */
    onChange?(isChecked: boolean, value?: string, name?: string, event?: SyntheticEvent): void;
    /** optional props for input */
    inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Checkbox';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<CheckboxProps> = {
    theme: Theme.light,
};

/**
 * Checkbox component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Checkbox: Comp<CheckboxProps, HTMLDivElement> = forwardRef((props, ref) => {
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
        inputProps = {},
        ...forwardedProps
    } = props;
    const inputId = useMemo(() => id || `${CLASSNAME.toLowerCase()}-${uid()}`, [id]);

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
                    type="checkbox"
                    id={inputId}
                    className={`${CLASSNAME}__input-native`}
                    disabled={isDisabled}
                    tabIndex={isDisabled ? -1 : 0}
                    name={name}
                    value={value}
                    checked={isChecked}
                    onChange={handleChange}
                    aria-describedby={helper ? `${inputId}-helper` : undefined}
                    {...inputProps}
                />

                <div className={`${CLASSNAME}__input-placeholder`}>
                    <div className={`${CLASSNAME}__input-background`} />

                    <div className={`${CLASSNAME}__input-indicator`}>
                        <Icon icon={mdiCheck} />
                    </div>
                </div>
            </div>

            <div className={`${CLASSNAME}__content`}>
                {label && (
                    <InputLabel htmlFor={inputId} className={`${CLASSNAME}__label`} theme={theme}>
                        {label}
                    </InputLabel>
                )}
                {helper && (
                    <InputHelper id={`${inputId}-helper`} className={`${CLASSNAME}__helper`} theme={theme}>
                        {helper}
                    </InputHelper>
                )}
            </div>
        </div>
    );
});
Checkbox.displayName = COMPONENT_NAME;
Checkbox.className = CLASSNAME;
Checkbox.defaultProps = DEFAULT_PROPS;
