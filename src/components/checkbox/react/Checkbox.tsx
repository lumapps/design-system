import React, { Children, cloneElement } from 'react';

import noop from 'lodash/noop';

import classNames from 'classnames';

import { mdiCheck } from '@mdi/js';

import { Icon, Theme, Themes } from 'LumX';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { CheckboxHelper } from './CheckboxHelper';
import { CheckboxLabel } from './CheckboxLabel';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import uniqueId from 'lodash/uniqueId';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ICheckboxProps extends IGenericProps {
    /* Is checkbox checked */
    checked?: boolean;
    /* Component label and helpers */
    children: CheckboxLabel | Array<CheckboxLabel & CheckboxHelper>;
    /* Is checkbox disabled */
    disabled?: boolean;
    /* Function called when a change occurs */
    onChange?: CallableFunction;
    /* Component theme */
    theme?: Theme;
}
type CheckboxProps = ICheckboxProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<CheckboxProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
const DEFAULT_PROPS: IDefaultPropsType = {
    checked: false,
    disabled: false,
    onChange: noop,
    theme: Themes.light,
};
/////////////////////////////

/**
 * Defines a checkbox.
 *
 * @return The component.
 */
const Checkbox: React.FC<CheckboxProps> = ({
    checked = DEFAULT_PROPS.checked,
    children,
    className = '',
    disabled = DEFAULT_PROPS.disabled,
    onChange = DEFAULT_PROPS.onChange,
    theme = DEFAULT_PROPS.theme,
    ...props
}: CheckboxProps): React.ReactElement => {
    const checkboxId: string = uniqueId(`${CLASSNAME.toLowerCase()}-`);
    const handleChange: () => void = (): void => {
        onChange!({ checked: !checked });
    };

    const clonedChildren: Array<CheckboxHelper | CheckboxLabel> = Children.map(
        children,
        (child: CheckboxHelper | CheckboxLabel) => {
            if (child.type.name === CheckboxLabel.name) {
                return cloneElement(child, { checkboxId });
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
                    type="checkbox"
                    id={checkboxId}
                    className={`${CLASSNAME}__input-native`}
                    tabIndex={disabled ? -1 : 0}
                    checked={checked}
                    onChange={handleChange}
                />

                <div className={`${CLASSNAME}__input-placeholder`}>
                    <div className={`${CLASSNAME}__input-background`} />

                    <div className={`${CLASSNAME}__input-indicator`}>
                        <Icon icon={mdiCheck} />
                    </div>
                </div>
            </div>

            <div className={`${CLASSNAME}__content`}>{clonedChildren}</div>
        </div>
    );
};
Checkbox.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Checkbox, CheckboxProps, Theme, Themes };
