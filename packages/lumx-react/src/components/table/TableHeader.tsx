import React, { ReactElement } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName } from '@lumx/react/utils';
import { handleBasicClasses } from '@lumx/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ITableHeaderProps extends IGenericProps {}
type TableHeaderProps = ITableHeaderProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<TableHeaderProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}TableHeader`;

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
 * The TableHeader component displays an HTML Table Head, composed TableHeader-cells in TableHeader Rows.
 *
 * @return The component.
 */
const TableHeader: React.FC<TableHeaderProps> = ({
    children,
    className = '',
    ...props
}: TableHeaderProps): ReactElement => (
    <thead className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
        {children}
    </thead>
);

/////////////////////////////

TableHeader.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, TableHeader, TableHeaderProps };
