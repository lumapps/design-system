import React, { Fragment, useCallback } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName, validateComponent } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { Icon } from 'LumX/components/icon/react/Icon';

import { IconSizes } from 'LumX';
import { mdiArrowDown, mdiArrowUp } from 'LumX/icons';

import isFunction from 'lodash/isFunction';
import noop from 'lodash/noop';

/////////////////////////////

/**
 * The authorized values for the `sortOrder` prop.
 */
enum Orders {
    asc = 'asc',
    desc = 'desc',
}
type Order = Orders;

/**
 * The authorized values for the `scope` prop.
 */
enum Scopes {
    col = 'col',
    row = 'row',
}
type Scope = Scopes;

/**
 * The authorized values for the `scope` prop.
 */
enum Variants {
    body = 'body',
    head = 'head',
}
type Variant = Variants;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ITableCellProps extends IGenericProps {
    /**
     * The mdi name of the icon (thead only).
     */
    icon?: string;

    /**
     * Whether the column is sortable or not (thead only).
     */
    isSortable?: boolean;

    /**
     * The scope of the thead, possible values: col/row.
     */
    scope?: Scope;

    /**
     * The initial sort order, possible values: asc/desc (sortable thead only).
     */
    sortOrder?: Order;

    /**
     * The variant of the cell, possible values: body/head.
     */
    variant?: Variant;

    /**
     * The function to call when we click on an order button.
     */
    onHeaderClick?(): void;
}
type TableCellProps = ITableCellProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<TableCellProps> {
    variant: Variant;
}

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
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}TableCell`;

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
    onHeaderClick: noop,
    variant: Variants.body,
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
 * @param  {TableCellProps}  props The children and props of the component.
 * @return {React.ReactNode} The processed children of the component.
 */
function _validate(props: TableCellProps): React.ReactNode {
    return validateComponent(COMPONENT_NAME, {
        props,
    });
}

/////////////////////////////

/**
 * The TableCell component displays an HTML Table Header Cell.
 *
 * @return {React.ReactElement} The component.
 */
const TableCell: React.FC<TableCellProps> = ({
    children,
    className = '',
    icon,
    isSortable,
    onHeaderClick = DEFAULT_PROPS.onHeaderClick,
    sortOrder,
    variant = DEFAULT_PROPS.variant,
    ...props
}: TableCellProps): React.ReactElement => {
    const newChildren: React.ReactNode = _validate({ children, onHeaderClick, variant, ...props });

    /**
     * Handle click on the ordered thead.
     */
    const handleOnHeaderClick: () => void = useCallback(() => {
        if (isFunction(onHeaderClick)) {
            onHeaderClick();
        }
    }, [onHeaderClick]);

    return (
        <Fragment>
            {variant === Variants.head && (
                <th
                    className={classNames(
                        'lumx-table__cell lumx-table__cell--header',
                        {
                            'lumx-table__cell--is-sortable': isSortable,
                            'lumx-table__cell--is-sorted': isSortable && sortOrder,
                        },
                        className,
                        handleBasicClasses({ prefix: CLASSNAME }),
                    )}
                    tabIndex={isSortable && isFunction(onHeaderClick) ? 1 : 0}
                    onClick={handleOnHeaderClick}
                    {...props}
                >
                    {icon && !isSortable && <Icon className="lumx-table__cell-icon" icon={icon} size={IconSizes.xxs} />}

                    {isSortable && sortOrder === Orders.asc && (
                        <Icon className="lumx-table__cell-icon" icon={mdiArrowUp} size={IconSizes.xxs} />
                    )}

                    {isSortable && sortOrder === Orders.desc && (
                        <Icon className="lumx-table__cell-icon" icon={mdiArrowDown} size={IconSizes.xxs} />
                    )}

                    <div className="lumx-table__cell-content">{newChildren}</div>
                </th>
            )}

            {variant === Variants.body && (
                <td
                    className={classNames(
                        'lumx-table__cell lumx-table__cell--body',
                        className,
                        handleBasicClasses({ prefix: CLASSNAME }),
                    )}
                    {...props}
                >
                    <div className="lumx-table__cell-content">{newChildren}</div>
                </td>
            )}
        </Fragment>
    );
};
TableCell.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Order, Orders, Scope, Scopes, TableCell, TableCellProps, Variant, Variants };
