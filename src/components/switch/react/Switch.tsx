import React, { Children, ReactElement, ReactNode, useState } from 'react';

import classNames from 'classnames';
import uuid from 'uuid/v4';

import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';

import { Theme } from 'LumX';
import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName, validateComponent } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

enum SwitchPosition {
    left = 'left',
    right = 'right',
}

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ISwitchProps extends IGenericProps {
    /**
     * Indicates if it is toggled on or not by default.
     */
    checked?: boolean;

    /**
     * A small help to display below.
     */
    helper?: string;

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

    /**
     * The function to execute when toggled.
     * This function will receive the new state.
     */
    onToggle?(enabled: boolean): void;
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
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Switch`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    checked: false,
    position: SwitchPosition.left,
    theme: Theme.light,
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
 * @param props The children and props of the component.
 * @return    The processed children of the component.
 */
function _validate(props: SwitchProps): ReactNode {
    return validateComponent(COMPONENT_NAME, {
        allowedTypes: ['text', <span />],
        maxChildren: 1,
        minChildren: 0,
        props,
    });
}

/////////////////////////////

/**
 * [Enter the description of the component here].
 *
 * @return The component.
 */
const Switch: React.FC<SwitchProps> = ({
    className = '',
    children,
    checked = DEFAULT_PROPS.checked,
    helper,
    onToggle,
    position = DEFAULT_PROPS.position,
    theme = DEFAULT_PROPS.theme,
    useCustomColors,
    ...props
}: SwitchProps): ReactElement => {
    const switchId: string = uuid();

    const newChildren: ReactNode = _validate({ children, checked, helper, position, theme, ...props });

    const [isChecked, setIsChecked] = useState(Boolean(checked));
    /**
     * Toggle the state of the <Switch> inner checkbox.
     */
    const toggleIsChecked = (): void => {
        setIsChecked(!isChecked);

        if (isFunction(onToggle)) {
            onToggle(!isChecked);
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
                { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
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

            {Children.count(newChildren) > 0 && (
                <div className={`${CLASSNAME}__content`}>
                    <label htmlFor={switchId} className={`${CLASSNAME}__label`}>
                        {newChildren}
                    </label>
                    {!isEmpty(helper) && <span className={`${CLASSNAME}__helper`}>{helper}</span>}
                </div>
            )}
        </div>
    );
};
Switch.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Switch, SwitchProps, SwitchPosition };
