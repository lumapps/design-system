import React, { ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import { Theme } from 'LumX';
import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import uniqueId from 'lodash/uniqueId';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IRadioButtonProps extends IGenericProps {
    /** Whether or not the radio button is checked. */
    checked?: boolean;

    /**  Whether or not the radio button is disabled. */
    disabled?: boolean;

    /** Radio button helper. */
    helper?: string;

    /** Native radio input id. */
    id?: string;

    /** Radio button label. */
    label?: ReactNode;

    /** Native radio input name. */
    name?: string;

    /** Theme. */
    theme?: Theme;

    /** Whether custom colors are applied to this component. */
    useCustomColors?: boolean;

    /** Native radio input value. */
    value?: string;

    /** Radio button onChange event (provides the radio input value).  */
    onChange?(value: string): void;
}
type RadioButtonProps = IRadioButtonProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<RadioButtonProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}RadioButton`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    checked: false,
    disabled: false,
    theme: Theme.light,
};
/////////////////////////////

/**
 * Defines a radio button.
 *
 * @return The component.
 */
const RadioButton: React.FC<RadioButtonProps> = (props: RadioButtonProps): ReactElement => {
    const {
        className,
        checked = DEFAULT_PROPS.checked,
        disabled = DEFAULT_PROPS.disabled,
        helper,
        id,
        label,
        name,
        theme = DEFAULT_PROPS.theme,
        useCustomColors,
        value,
        onChange,
        ...forwardedProps
    } = props;
    const radioButtonId: string = id || uniqueId(`${CLASSNAME.toLowerCase()}-`);
    const handleChange = (): void => {
        if (onChange && value) {
            onChange(value);
        }
    };

    return (
        <div
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
                    checked={checked}
                    className={`${CLASSNAME}__input-native`}
                    disabled={disabled}
                    name={name}
                    id={radioButtonId}
                    tabIndex={disabled ? -1 : 0}
                    type="radio"
                    value={value}
                    onChange={handleChange}
                    {...forwardedProps}
                />

                <div className={`${CLASSNAME}__input-placeholder`}>
                    <div className={`${CLASSNAME}__input-background`} />
                    <div className={`${CLASSNAME}__input-indicator`} />
                </div>
            </div>

            <div className={`${CLASSNAME}__content`}>
                {label && (
                    <label htmlFor={radioButtonId} className={`${CLASSNAME}__label`}>
                        {label}
                    </label>
                )}
                {helper && <span className={`${CLASSNAME}__helper`}>{helper}</span>}
            </div>
        </div>
    );
};
RadioButton.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, RadioButton, RadioButtonProps };
