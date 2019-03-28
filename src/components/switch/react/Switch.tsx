import React, { useState } from 'react';

import classNames from 'classnames';
import uuid from 'uuid/v4';

import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';

import { Theme, Themes } from 'LumX/components';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName, validateComponent } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

enum Positions {
    left = 'left',
    right = 'right',
}
type Position = Positions;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ISwitchProps extends IGenericProps {
    /**
     * Indicates if the <Switch> is toggled on or not by default.
     */
    checked?: boolean;

    /**
     * <Switch> doesn't accept any child.
     */
    children?: never;

    /**
     * A small help to display below the <Switch>.
     */
    helper?: string;

    /**
     * The label of the <Switch>.
     */
    label?: string;

    /**
     * The position of the label regarding the <Switch> toggle.
     */
    position?: Position;

    /**
     * The <Switch> theme.
     */
    theme?: Theme;
}
type SwitchProps = ISwitchProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<SwitchProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}Switch`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    checked: false,
    position: Positions.left,
    theme: Themes.light,
};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Validate the component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {SwitchProps} props The children and props of the component.
 * @return {React.ReactNode}    The processed children of the component.
 */
function _validate(props: SwitchProps): React.ReactNode {
    return validateComponent(COMPONENT_NAME, {
        maxChildren: 0,
        props,
    });
}

/////////////////////////////

/**
 * [Enter the description of the component here].
 *
 * @return {React.ReactElement} The component.
 */
const Switch: React.FC<SwitchProps> = ({
    className = '',
    checked = DEFAULT_PROPS.checked,
    helper,
    label,
    position = DEFAULT_PROPS.position,
    theme = DEFAULT_PROPS.theme,
    ...props
}: SwitchProps): React.ReactElement => {
    const switchId: string = uuid();

    _validate({ checked, helper, label, position, theme, ...props });

    const [isChecked, setIsChecked]: [boolean, (isChecked: boolean) => void] = useState(Boolean(checked));
    /**
     * Toggle the state of the <Switch> inner checkbox.
     */
    const toggleIsChecked: (evt: React.MouseEvent<HTMLElement>) => void = (): void => {
        setIsChecked(!isChecked);

        if (isFunction(props.onClick)) {
            return props.onClick(!isChecked);
        }
    };

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,

                    checked: Boolean(isChecked),
                    disabled: props.disabled,
                    position,
                    theme,
                    unchecked: !Boolean(isChecked),
                }),
            )}
            {...props}
        >
            <div className={`${CLASSNAME}__input-wrapper`}>
                <input
                    type="checkbox"
                    id={switchId}
                    className={`${CLASSNAME}__input-native`}
                    value={String(isChecked)}
                    onClick={toggleIsChecked}
                />

                <div className={`${CLASSNAME}__input-placeholder`}>
                    <div className={`${CLASSNAME}__input-background`} />
                    <div className={`${CLASSNAME}__input-indicator`} />
                </div>
            </div>

            {!isEmpty(label) && (
                <div className={`${CLASSNAME}__content`}>
                    <label htmlFor={switchId} className={`${CLASSNAME}__label`}>
                        {label}
                    </label>
                    {!isEmpty(helper) && <span className={`${CLASSNAME}__helper`}>{helper}</span>}
                </div>
            )}
        </div>
    );
};
Switch.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Position, Positions, Switch, SwitchProps, Theme, Themes };
