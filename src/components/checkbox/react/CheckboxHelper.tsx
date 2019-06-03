import React from 'react';

import classNames from 'classnames';

import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX } from 'LumX/react/constants';

import { handleBasicClasses } from 'LumX/core/utils';
import { IGenericProps } from 'LumX/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ICheckboxHelperProps extends IGenericProps {}
type CheckboxHelperProps = ICheckboxHelperProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<CheckboxHelperProps> {}

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
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}CheckboxHelper`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = `${CSS_PREFIX}-checkbox__helper`;

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {};

/////////////////////////////

/**
 * Define a checkbox helper component.
 *
 * @return {React.ReactElement} The component.
 */
const CheckboxHelper: React.FC<CheckboxHelperProps> = ({
    children,
    className = '',
    ...props
}: CheckboxHelperProps): React.ReactElement => {
    return (
        <span className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
            {children}
        </span>
    );
};
CheckboxHelper.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, CheckboxHelper, CheckboxHelperProps };
