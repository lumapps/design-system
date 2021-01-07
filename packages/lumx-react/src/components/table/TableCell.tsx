import React, { forwardRef, useCallback } from 'react';

import classNames from 'classnames';

import { Icon, Size } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses, onEnterPressed, ValueOf } from '@lumx/react/utils';

import { mdiArrowDown, mdiArrowUp } from '@lumx/icons';

import isFunction from 'lodash/isFunction';

/**
 * Table head cell sort order.
 */
export const ThOrder = { asc: 'asc', desc: 'desc' } as const;
export type ThOrder = ValueOf<typeof ThOrder>;

/**
 * Table cell variants.
 */
export const TableCellVariant = { body: 'body', head: 'head' } as const;
export type TableCellVariant = ValueOf<typeof TableCellVariant>;

/**
 * Defines the props of the component.
 */
export interface TableCellProps extends GenericProps {
    /** Icon (SVG path).(thead only). */
    icon?: string;
    /** Whether the column is sortable or not (thead only). */
    isSortable?: boolean;
    /** Sort order displayed as icon (sortable thead only). */
    sortOrder?: ThOrder;
    /** Variant. */
    variant?: TableCellVariant;
    /** On header cell click callback. */
    onHeaderClick?(): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'TableCell';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME, true);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<TableCellProps> = {
    variant: TableCellVariant.body,
};

/**
 * TableCell component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TableCell: Comp<TableCellProps, HTMLTableCellElement> = forwardRef((props, ref) => {
    const { children, className, icon, isSortable, onHeaderClick, sortOrder, variant, ...forwardedProps } = props;

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
                    ref={ref}
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
});
TableCell.displayName = COMPONENT_NAME;
TableCell.className = CLASSNAME;
TableCell.defaultProps = DEFAULT_PROPS;
