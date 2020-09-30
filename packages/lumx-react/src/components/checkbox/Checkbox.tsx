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
    /** The helper of the checkbox. */
    helper?: string;
    /** The native input id property. */
    id?: string;
    /** Whether it is checked or not. */
    isChecked?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** The label of the checkbox. */
    label?: ReactNode;
    /** The native input name property. */
    name?: string;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** Whether custom colors are applied to this component or not. */
    useCustomColors?: boolean;
    /** The native input value property. */
    value?: string;
    /** The function called on change. */
    onChange?(isChecked: boolean, value?: string, name?: string, event?: SyntheticEvent): void;
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
    isChecked = checked,
    isDisabled = disabled,
    label,
    name,
    onChange,
    theme,
    useCustomColors,
    value,
    ...forwardedProps
}) => {
    const inputId = id || uniqueId(`${CLASSNAME.toLowerCase()}-`);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(!isChecked, value, name, event);
        }
    };

    return (
        <div
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
                { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
            )}
        >
            <div className={`${CLASSNAME}__input-wrapper`}>
                <input
                    type="checkbox"
                    id={inputId}
                    className={`${CLASSNAME}__input-native`}
                    tabIndex={isDisabled ? -1 : 0}
                    name={name}
                    value={value}
                    checked={isChecked}
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
Checkbox.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Checkbox, CheckboxProps };
