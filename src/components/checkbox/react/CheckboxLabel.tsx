import React, { ReactChild } from 'react';

import classNames from 'classnames';

import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX } from 'LumX/react/constants';

import { handleBasicClasses } from 'LumX/core/utils';
import { IGenericProps } from 'LumX/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ICheckboxLabelProps extends IGenericProps {
    checkboxId?: string;
    children?: ReactChild;
}
type CheckboxLabelProps = ICheckboxLabelProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<CheckboxLabelProps> {}

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
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}CheckboxLabel`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = `${CSS_PREFIX}-checkbox__label`;

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    children: '',
};

/////////////////////////////

/**
 * Define a checkbox label component.
 *
 * @return {React.ReactElement} The component.
 */
const CheckboxLabel: React.FC<CheckboxLabelProps> = ({
    checkboxId,
    children = DEFAULT_PROPS.children,
    className = '',
    ...props
}: CheckboxLabelProps): React.ReactElement => {
    return (
        <label
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}
            htmlFor={checkboxId}
            {...props}
        >
            {children}
        </label>
    );
};
CheckboxLabel.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, CheckboxLabel, CheckboxLabelProps };
