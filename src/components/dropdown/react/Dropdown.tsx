import { IGenericProps } from 'LumX/react/utils';

/////////////////////////////

import React from 'react';

import classNames from 'classnames';

import { CSS_PREFIX } from 'LumX/core/constants';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * Defines the props of the <LxDropdown> component.
 */
interface ILxDropdownProps extends IGenericProps {}
type LxDropdownProps = ILxDropdownProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface ILxDropdownDefaultPropsType extends Partial<LxDropdownProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = `${CSS_PREFIX}-dropdown`;

/**
 * The display name of the component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = 'LxDropdown';

/**
 * The default value of props.
 *
 * @type {ILxDropdownDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: ILxDropdownDefaultPropsType = {};

/////////////////////////////

/**
 * Displays a dropdown.
 *
 * @return {JSX.Element} The <LxDropdown> root component.
 */
const LxDropdown: React.FC<LxDropdownProps> = ({
    children,
    className = '',
    ...props
}: LxDropdownProps): JSX.Element => {
    return (
        <div className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
            {children}
        </div>
    );
};
LxDropdown.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, LxDropdown, LxDropdownProps };
