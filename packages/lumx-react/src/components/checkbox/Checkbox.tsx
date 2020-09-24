import React, { ReactNode, SyntheticEvent } from 'react';

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
    /** Whether it is toggled on or not. */
    checked?: boolean;
    /** Is checkbox disabled */
    disabled?: boolean;
    /** Helper */
    helper?: string;
    /** Native input id */
    id?: string;
    /** Label */
    label?: ReactNode;
    /** Name of the checkbox. */
    name?: string;
    /** Component theme */
    theme?: Theme;
    /** Whether custom colors are applied to this component. */
    useCustomColors?: boolean;
    /** String representation of the boolean checked value. */
    value?: string;
    /** Checkbox value change handler. */
    onChange?(checked: boolean, value?: string, name?: string, event?: SyntheticEvent): void;
}

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
const DEFAULT_PROPS: Partial<CheckboxProps> = {
    theme: Theme.light,
    checked: false,
};

/**
 * Defines a checkbox.
 *
 * @return The component.
 */
const Checkbox: React.FC<CheckboxProps> = ({
    checked,
    className,
    disabled,
    helper,
    id,
    label,
    name,
    onChange,
    theme,
    useCustomColors,
    value,
    ...forwardedProps
}) => {
    const inputId = id || uniqueId(`${CLASSNAME.toLowerCase()}-`);
    const toggleIsChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(!checked, value, name, event);
        }
    };

    return (
        <div
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    isChecked: checked,
                    isDisabled: disabled,
                    isUnchecked: !checked,
                    prefix: CLASSNAME,
                    theme,
                }),
                { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
            )}
        >
            <div className={`${CLASSNAME}__input-wrapper`}>
                <input
                    type="checkbox"
                    id={inputId}
                    className={`${CLASSNAME}__input-native`}
                    tabIndex={disabled ? -1 : 0}
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={toggleIsChecked}
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
Checkbox.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Checkbox, CheckboxProps };
