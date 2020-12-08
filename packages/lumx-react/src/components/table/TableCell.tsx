import React, { useCallback } from 'react';

import classNames from 'classnames';

import { Icon, Size } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses, onEnterPressed } from '@lumx/react/utils';

import { mdiArrowDown, mdiArrowUp } from '@lumx/icons';

import isFunction from 'lodash/isFunction';

/**
 * The authorized values for the `sortOrder` prop.
 */
export enum ThOrder {
    asc = 'asc',
    desc = 'desc',
}

/**
 * The authorized values for the `scope` prop.
 */
export enum ThScope {
    col = 'col',
    row = 'row',
}

/**
 * The authorized variants.
 */
export enum TableCellVariant {
    body = 'body',
    head = 'head',
}

/**
 * Defines the props of the component.
 */
export interface TableCellProps extends GenericProps {
    /** The name of the icon (thead only). */
    icon?: string;
    /** Whether the column is sortable or not (thead only). */
    isSortable?: boolean;
    /** The scope of the thead. */
    scope?: ThScope;
    /** The initial sort order (sortable thead only). */
    sortOrder?: ThOrder;
    /** The variant of the cell. */
    variant?: TableCellVariant;
    /** The function called on click on header. */
    onHeaderClick?(): void;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}TableCell`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME, true);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<TableCellProps> = {
    variant: TableCellVariant.body,
};

export const TableCell: Comp<TableCellProps> = ({
    children,
    className,
    icon,
    isSortable,
    onHeaderClick,
    sortOrder,
    variant,
    ...forwardedProps
}) => {
    /**
     * Handle click on the ordered thead.
     */
    const handleOnHeaderClick = useCallback(() => {
        if (isFunction(onHeaderClick)) {
            onHeaderClick();
        }
    }, [onHeaderClick]);

    return (
        <>
            {variant === TableCellVariant.head && (
                <th
                    {...forwardedProps}
                    className={classNames(
                        handleBasicClasses({ prefix: CLASSNAME, isSortable }),
                        className,
                        `${CLASSNAME}--head`,
                        {
                            [`${CLASSNAME}--is-sorted`]: isSortable && sortOrder,
                        },
                    )}
                    tabIndex={isSortable && isFunction(onHeaderClick) ? 0 : -1}
                    onClick={handleOnHeaderClick}
                    onKeyDown={onEnterPressed(handleOnHeaderClick)}
                >
                    <div className={`${CLASSNAME}-wrapper`}>
                        {icon && !isSortable && <Icon className={`${CLASSNAME}-icon`} icon={icon} size={Size.xxs} />}

                        {isSortable && sortOrder === ThOrder.asc && (
                            <Icon className={`${CLASSNAME}-icon`} icon={mdiArrowUp} size={Size.xxs} />
                        )}

                        {isSortable && sortOrder === ThOrder.desc && (
                            <Icon className={`${CLASSNAME}-icon`} icon={mdiArrowDown} size={Size.xxs} />
                        )}

                        <div className={`${CLASSNAME}-content`}>{children}</div>
                    </div>
                </th>
            )}

            {variant === TableCellVariant.body && (
                <td
                    {...forwardedProps}
                    className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }), `${CLASSNAME}--body`)}
                >
                    <div className={`${CLASSNAME}-content`}>{children}</div>
                </td>
            )}
        </>
    );
};
TableCell.displayName = COMPONENT_NAME;
TableCell.className = CLASSNAME;
TableCell.defaultProps = DEFAULT_PROPS;
