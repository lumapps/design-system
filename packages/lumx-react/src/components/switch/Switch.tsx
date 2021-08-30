import React, { Children, forwardRef, SyntheticEvent, useMemo } from 'react';

import classNames from 'classnames';
import { uid } from 'uid';

import isEmpty from 'lodash/isEmpty';

import { Alignment, InputHelper, InputLabel, Theme } from '@lumx/react';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface SwitchProps extends GenericProps {
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
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Native input value property. */
    value?: string;
    /** On change callback. */
    onChange?(isChecked: boolean, value?: string, name?: string, event?: SyntheticEvent): void;
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
    theme: Theme.light,
};

/**
 * Switch component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Switch: Comp<SwitchProps, HTMLDivElement> = forwardRef((props, ref) => {
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
        theme,
        value,
        ...forwardedProps
    } = props;
    const switchId = useMemo(() => id || `switch-${uid()}`, [id]);
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
                    id={switchId}
                    className={`${CLASSNAME}__input-native`}
                    name={name}
                    value={value}
                    disabled={isDisabled}
                    checked={isChecked}
                    aria-checked={Boolean(isChecked)}
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
});
Switch.displayName = COMPONENT_NAME;
Switch.className = CLASSNAME;
Switch.defaultProps = DEFAULT_PROPS;
