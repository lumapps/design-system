import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName } from '@lumx/react/utils';
import { handleBasicClasses } from '@lumx/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ITableRowProps extends IGenericProps {}
type TableRowProps = ITableRowProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<TableRowProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}TableRow`;

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
 * The TableRow component displays an HTML Table Row, which contains table cells.
 *
 * @return The component.
 */
const TableRow: React.FC<TableRowProps> = ({ children, className = '', ...props }: TableRowProps): ReactElement => (
    <tr className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
        {children}
    </tr>
);

/////////////////////////////

TableRow.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, TableRow, TableRowProps };
