import React from 'react';

import classNames from 'classnames';

import { Theme, Themes } from 'LumX/components';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName, validateComponent } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ITableProps extends IGenericProps {
    /**
     * Wether the table has dividers
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
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}Table`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    hasDividers: false,
    theme: Themes.light,
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
 * @param  {TableProps}      props The children and props of the component.
 * @return {React.ReactNode} The processed children of the component.
 */
function _validate(props: TableProps): React.ReactNode {
    return validateComponent(COMPONENT_NAME, {
        props,
    });
}

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
}: TableProps): React.ReactElement => {
    const newChildren: React.ReactNode = _validate({ children, hasDividers, ...props });

    return (
        <table
            className={classNames(
                className,
                { 'lumx-table--has-dividers': hasDividers },
                handleBasicClasses({ prefix: CLASSNAME, theme }),
            )}
            {...props}
        >
            {newChildren}
        </table>
    );
};
Table.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Table, TableProps, Theme };
