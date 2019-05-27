import React, { Fragment, useCallback } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses, onEnterPressed } from 'LumX/core/utils';

import { Icon } from 'LumX/components/icon/react/Icon';

import { IconSizes } from 'LumX';
import { mdiArrowDown, mdiArrowUp } from 'LumX/icons';

import isFunction from 'lodash/isFunction';

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
 * The authorized variants.
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
     * The scope of the thead.
     */
    scope?: Scope;

    /**
     * The initial sort order (sortable thead only).
     */
    sortOrder?: Order;

    /**
     * The variant of the cell.
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
const CLASSNAME: string = getRootClassName(COMPONENT_NAME, true);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    onHeaderClick: undefined,
    variant: Variants.body,
};

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
                        handleBasicClasses({ prefix: CLASSNAME, isSortable }),
                        className,
                        `${CLASSNAME}--header`,
                        {
                            [`${CLASSNAME}--is-sorted`]: isSortable && sortOrder,
                        },
                    )}
                    tabIndex={isSortable && isFunction(onHeaderClick) ? 1 : 0}
                    onClick={handleOnHeaderClick}
                    onKeyDown={onEnterPressed(handleOnHeaderClick)}
                    {...props}
                >
                    {icon && !isSortable && <Icon className={`${CLASSNAME}-icon`} icon={icon} size={IconSizes.xxs} />}

                    {isSortable && sortOrder === Orders.asc && (
                        <Icon className={`${CLASSNAME}-icon`} icon={mdiArrowUp} size={IconSizes.xxs} />
                    )}

                    {isSortable && sortOrder === Orders.desc && (
                        <Icon className={`${CLASSNAME}-icon`} icon={mdiArrowDown} size={IconSizes.xxs} />
                    )}

                    <div className={`${CLASSNAME}-content`}>{children}</div>
                </th>
            )}

            {variant === Variants.body && (
                <td
                    className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }), `${CLASSNAME}--body`)}
                    {...props}
                >
                    <div className={`${CLASSNAME}-content`}>{children}</div>
                </td>
            )}
        </Fragment>
    );
};
TableCell.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Order, Orders, Scope, Scopes, TableCell, TableCellProps, Variant, Variants };
