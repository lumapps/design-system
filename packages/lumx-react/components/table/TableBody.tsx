import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/core/react/constants';
import { IGenericProps, getRootClassName } from '@lumx/core/react/utils';
import { handleBasicClasses } from '@lumx/core/utils';

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
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}TableBody`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME, true);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {};

/////////////////////////////

/**
 * The TableBody component displays an HTML Table Body, composed TableBody-cells in TableBody Rows.
 *
 * @return The component.
 */
const TableBody: React.FC<TableBodyProps> = ({ children, className = '', ...props }: TableBodyProps): ReactElement => (
    <tbody className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
        {children}
    </tbody>
);

/////////////////////////////

TableBody.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, TableBody, TableBodyProps };
