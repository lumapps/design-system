import React, { Children, SyntheticEvent } from 'react';

import classNames from 'classnames';
import uuid from 'uuid/v4';

import isEmpty from 'lodash/isEmpty';

import { InputHelper, InputLabel, Theme } from '@lumx/react';

import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

enum SwitchPosition {
    left = 'left',
    right = 'right',
}

/**
 * Defines the props of the component.
 */
interface SwitchProps extends GenericProps {
    /** Whether it is toggled on or not. */
    checked?: boolean;

    /**
     * A small help to display below.
     */
    helper?: string;

    /** Name of the switch. */
    name?: string;

    /**
     * The position of the toggle regarding the label.
     */
    position?: SwitchPosition;

    /**
     * The theme.
     */
    theme?: Theme;

    /** Whether custom colors are applied to this component. */
    useCustomColors?: boolean;

    /** String representation of the boolean checked value. */
    value?: string;

    /** Switch value change handler. */
    onChange?(checked: boolean, value?: string, name?: string, event?: SyntheticEvent): void;
}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<SwitchProps> {}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Switch`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: DefaultPropsType = {
    checked: false,
    position: SwitchPosition.left,
    theme: Theme.light,
};

/**
 * [Enter the description of the component here].
 *
 * @return The component.
 */
const Switch: React.FC<SwitchProps> = ({
    className,
    children,
    checked = DEFAULT_PROPS.checked,
    helper,
    name,
    onChange,
    position = DEFAULT_PROPS.position,
    theme = DEFAULT_PROPS.theme,
    useCustomColors,
    value,
    ...forwardedProps
}) => {
    const switchId: string = uuid();

    /**
     * Toggle the state of the <Switch> inner checkbox.
     * @param event Change event.
     */
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
                    prefix: CLASSNAME,

                    checked: Boolean(checked),
                    disabled: forwardedProps.disabled,
                    position,
                    theme,
                    unchecked: !Boolean(checked),
                }),
                { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
            )}
        >
            <div className={`${CLASSNAME}__input-wrapper`}>
                <input
                    type="checkbox"
                    id={switchId}
                    className={`${CLASSNAME}__input-native`}
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={toggleIsChecked}
                />

                <div className={`${CLASSNAME}__input-placeholder`}>
                    <div className={`${CLASSNAME}__input-background`} />
                    <div className={`${CLASSNAME}__input-indicator`} />
                </div>
            </div>

            {Children.count(children) > 0 && (
                <div className={`${CLASSNAME}__content`}>
                    <InputLabel htmlFor={switchId} theme={theme} className={`${CLASSNAME}__label`}>
                        {children}
                    </InputLabel>
                    {!isEmpty(helper) && (
                        <InputHelper theme={theme} className={`${CLASSNAME}__helper`}>
                            {helper}
                        </InputHelper>
                    )}
                </div>
            )}
        </div>
    );
};
Switch.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, Switch, SwitchProps, SwitchPosition };
