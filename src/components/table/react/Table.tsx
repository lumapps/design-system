import React from 'react';

import classNames from 'classnames';

import { Theme, Themes } from 'LumX/components';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ITableProps extends IGenericProps {
    /**
     * Whether the table has dividers
     */
    hasDividers?: boolean;
    /**
     * The theme.
     */
    theme?: Theme;
}
type TableProps = ITableProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<TableProps> {}

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
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}Table`;

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
const DEFAULT_PROPS: IDefaultPropsType = {
    hasDividers: false,
    theme: Themes.light,
};

/////////////////////////////

/**
 * The Table component displays an HTML table, composed by a Table-head and a Table-body with Table-cells in Table Rows.
 *
 * @return {React.ReactElement} The component.
 */
const Table: React.FC<TableProps> = ({
    children,
    className = '',
    hasDividers,
    theme = DEFAULT_PROPS.theme,
    ...props
}: TableProps): React.ReactElement => (
    <table className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, hasDividers, theme }))} {...props}>
        {children}
    </table>
);

/////////////////////////////

Table.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Table, TableProps, Theme };
