import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ITableBodyProps extends IGenericProps {}
type TableBodyProps = ITableBodyProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<TableBodyProps> {}

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
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}TableBody`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 */
const DEFAULT_PROPS: IDefaultPropsType = {};

/////////////////////////////

/**
 * The TableBody component displays an HTML Table Body, composed TableBody-cells in TableBody Rows.
 *
 * @return {React.ReactElement} The component.
 */
const TableBody: React.FC<TableBodyProps> = ({
    children,
    className = '',
    ...props
}: TableBodyProps): React.ReactElement => (
    <tbody className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
        {children}
    </tbody>
);

/////////////////////////////

TableBody.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, TableBody, TableBodyProps };
