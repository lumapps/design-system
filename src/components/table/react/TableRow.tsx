import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName, validateComponent } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

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
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}TableRow`;

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
const DEFAULT_PROPS: IDefaultPropsType = {};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Validate the component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {TableRowProps}  props The children and props of the component.
 * @return {React.ReactNode} The processed children of the component.
 */
function _validate(props: TableRowProps): React.ReactNode {
    return validateComponent(COMPONENT_NAME, {
        props,
    });
}

/////////////////////////////

/**
 * The TableRow component displays an HTML Table Row, which contains table cells.
 *
 * @return {React.ReactElement} The component.
 */
const TableRow: React.FC<TableRowProps> = ({
    children,
    className = '',
    ...props
}: TableRowProps): React.ReactElement => {
    const newChildren: React.ReactNode = _validate({ children, ...props });

    return (
        <tr className={classNames('lumx-table__row', className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
            {newChildren}
        </tr>
    );
};

TableRow.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, TableRow, TableRowProps };
