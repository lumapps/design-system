import React, { Children, ReactElement, cloneElement } from 'react';

import noop from 'lodash/noop';

import classNames from 'classnames';

import { Theme } from 'LumX';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { RadioButtonHelper } from './RadioButtonHelper';
import { RadioButtonLabel } from './RadioButtonLabel';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import uniqueId from 'lodash/uniqueId';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IRadioButtonProps extends IGenericProps {
    /* Is radio button checked */
    checked?: boolean;
    /* Component label and helpers */
    children: RadioButtonLabel | Array<RadioButtonLabel & RadioButtonHelper>;
    /* Is radio button disabled */
    disabled?: boolean;
    /*The name of theradio button */
    name: string;
    /* Function called when a change occurs */
    onChange?: CallableFunction;
    /* Component theme */
    theme?: Theme;
    /* The value of the radio button */
    value: string;
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
    onChange: noop,
    theme: Theme.light,
};
/////////////////////////////

/**
 * Defines a radio button.
 *
 * @return The component.
 */
const RadioButton: React.FC<RadioButtonProps> = ({
    checked = DEFAULT_PROPS.checked,
    children,
    className = '',
    disabled = DEFAULT_PROPS.disabled,
    name,
    onChange = DEFAULT_PROPS.onChange,
    theme = DEFAULT_PROPS.theme,
    value,
    ...props
}: RadioButtonProps): ReactElement => {
    const radioButtonId: string = uniqueId(`${CLASSNAME.toLowerCase()}-`);
    const handleChange = (): void => {
        onChange!({ value });
    };

    const clonedChildren: Array<RadioButtonHelper | RadioButtonLabel> = Children.map(
        children,
        (child: RadioButtonHelper | RadioButtonLabel) => {
            if (child.type.name === RadioButtonLabel.name) {
                return cloneElement(child, { radioButtonId });
            }

            return cloneElement(child);
        },
    );

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
            )}
            {...props}
        >
            <div className={`${CLASSNAME}__input-wrapper`}>
                <input
                    type="radio"
                    id={radioButtonId}
                    className={`${CLASSNAME}__input-native`}
                    tabIndex={disabled ? -1 : 0}
                    name={name}
                    checked={checked}
                    disabled={disabled}
                    value={value}
                    onChange={handleChange}
                />

                <div className={`${CLASSNAME}__input-placeholder`}>
                    <div className={`${CLASSNAME}__input-background`} />
                    <div className={`${CLASSNAME}__input-indicator`} />
                </div>
            </div>

            <div className={`${CLASSNAME}__content`}>{clonedChildren}</div>
        </div>
    );
};
RadioButton.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, RadioButton, RadioButtonProps };
