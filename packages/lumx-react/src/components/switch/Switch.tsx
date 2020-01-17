import React, { Children, ReactElement, ReactNode } from 'react';

import classNames from 'classnames';
import uuid from 'uuid/v4';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { InputHelper, InputLabel, Theme } from '@lumx/react';

import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses, validateComponent } from '@lumx/react/utils';

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
     * Indicates if it is toggled on or not.
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

    /** Switch value change handler. */
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

    /**
     * Toggle the state of the <Switch> inner checkbox.
     * @param event Change event.
     */
    const toggleIsChecked = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (onToggle) {
            onToggle(get(event, 'target.checked'));
        }
    };

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,

                    checked: Boolean(checked),
                    disabled: props.disabled,
                    position,
                    theme,
                    unchecked: !Boolean(checked),
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
                    checked={checked}
                    onChange={toggleIsChecked}
                />

                <div className={`${CLASSNAME}__input-placeholder`}>
                    <div className={`${CLASSNAME}__input-background`} />
                    <div className={`${CLASSNAME}__input-indicator`} />
                </div>
            </div>

            {Children.count(newChildren) > 0 && (
                <div className={`${CLASSNAME}__content`}>
                    <InputLabel htmlFor={switchId} theme={theme} className={`${CLASSNAME}__label`}>
                        {newChildren}
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

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Switch, SwitchProps, SwitchPosition };
