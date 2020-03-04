import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { mdiCheck } from '@lumx/icons';

import { Icon, InputHelper, InputLabel, Theme } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import uniqueId from 'lodash/uniqueId';

/**
 * Defines the props of the component.
 */
interface CheckboxProps extends GenericProps {
    /** Is checkbox disabled */
    disabled?: boolean;
    /** Helper */
    helper?: string;
    /** Native input id */
    id?: string;
    /** Label */
    label?: ReactNode;
    /** Component theme */
    theme?: Theme;
    /** Whether custom colors are applied to this component. */
    useCustomColors?: boolean;
    /** Is checkbox checked */
    value?: boolean;
    /**
     * Checkbox onChange event.
     * @param value New checked value.
     */
    onChange(value: boolean): void;
}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<CheckboxProps> {}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Checkbox`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: DefaultPropsType = {
    disabled: false,
    theme: Theme.light,
    value: false,
};

/**
 * Defines a checkbox.
 *
 * @return The component.
 */
const Checkbox: React.FC<CheckboxProps> = ({
    className,
    disabled = DEFAULT_PROPS.disabled,
    helper,
    id,
    label,
    onChange,
    theme = DEFAULT_PROPS.theme,
    useCustomColors,
    value = DEFAULT_PROPS.value,
    ...props
}) => {
    const inputId = id || uniqueId(`${CLASSNAME.toLowerCase()}-`);
    const handleChange = () => {
        onChange(!value);
    };

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    isChecked: value,
                    isDisabled: disabled,
                    isUnchecked: !value,
                    prefix: CLASSNAME,
                    theme,
                }),
                { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
            )}
            {...props}
        >
            <div className={`${CLASSNAME}__input-wrapper`}>
                <input
                    type="checkbox"
                    id={inputId}
                    className={`${CLASSNAME}__input-native`}
                    tabIndex={disabled ? -1 : 0}
                    checked={value}
                    onChange={handleChange}
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
                    <InputHelper className={`${CLASSNAME}__helper`} theme={theme}>
                        {helper}
                    </InputHelper>
                )}
            </div>
        </div>
    );
};
Checkbox.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, Checkbox, CheckboxProps };
