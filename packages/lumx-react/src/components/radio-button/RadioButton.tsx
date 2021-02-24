import React, { useMemo, forwardRef, ReactNode, SyntheticEvent } from 'react';

import classNames from 'classnames';
import { uid } from 'uid';

import { InputHelper, InputLabel, Theme } from '@lumx/react';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface RadioButtonProps extends GenericProps {
    /** Helper text. */
    helper?: string;
    /** Native input id property. */
    id?: string;
    /** Whether it is checked or not. */
    isChecked?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Label content. */
    label?: ReactNode;
    /** Native input name property. */
    name?: string;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Native input value property. */
    value?: string;
    /** On change callback. */
    onChange?(value?: string, name?: string, event?: SyntheticEvent): void;
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
        isChecked = checked,
        isDisabled = disabled,
        label,
        name,
        onChange,
        theme,
        value,
        ...forwardedProps
    } = props;
    const radioButtonId = useMemo(() => id || `${CLASSNAME.toLowerCase()}-${uid()}`, [id]);

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
                    className={`${CLASSNAME}__input-native`}
                    disabled={isDisabled}
                    id={radioButtonId}
                    tabIndex={isDisabled ? -1 : 0}
                    type="radio"
                    name={name}
                    value={value}
                    checked={isChecked}
                    onChange={handleChange}
                />

                <div className={`${CLASSNAME}__input-placeholder`}>
                    <div className={`${CLASSNAME}__input-background`} />
                    <div className={`${CLASSNAME}__input-indicator`} />
                </div>
            </div>

            <div className={`${CLASSNAME}__content`}>
                {label && (
                    <InputLabel htmlFor={radioButtonId} theme={theme} className={`${CLASSNAME}__label`}>
                        {label}
                    </InputLabel>
                )}
                {helper && (
                    <InputHelper theme={theme} className={`${CLASSNAME}__helper`}>
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
