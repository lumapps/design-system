import React, { Children, SyntheticEvent, useMemo } from 'react';

import classNames from 'classnames';
import uuid from 'uuid/v4';

import isEmpty from 'lodash/isEmpty';

import { InputHelper, InputLabel, Theme } from '@lumx/react';

import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { GenericProps, ValueOf, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

enum SwitchPosition {
    left = 'left',
    right = 'right',
}

/**
 * Defines the props of the component.
 */
interface SwitchProps extends GenericProps {
    /** The helper of the switch. */
    helper?: string;
    /** Whether it is checked or not. */
    isChecked?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** The native input name property. */
    name?: string;
    /** The position of the toggle regarding the label. */
    position?: ValueOf<SwitchPosition>;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: ValueOf<Theme>;
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
const COMPONENT_NAME = `${COMPONENT_PREFIX}Switch`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<SwitchProps> = {
    position: SwitchPosition.left,
    theme: Theme.light,
};

const Switch: React.FC<SwitchProps> = ({
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
    theme,
    useCustomColors,
    value,
    ...forwardedProps
}) => {
    const switchId = useMemo(() => id || `switch-${uuid()}`, [id]);
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
                    prefix: CLASSNAME,
                    isChecked,
                    isDisabled,
                    position,
                    theme,
                    isUnchecked: !isChecked,
                }),
                { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
            )}
            aria-disabled={isDisabled}
        >
            <div className={`${CLASSNAME}__input-wrapper`}>
                <input
                    type="checkbox"
                    id={switchId}
                    className={`${CLASSNAME}__input-native`}
                    name={name}
                    value={value}
                    disabled={isDisabled}
                    checked={isChecked}
                    onChange={handleChange}
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
Switch.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Switch, SwitchProps, SwitchPosition };
