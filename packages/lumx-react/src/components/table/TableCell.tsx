import React from 'react';

import classNames from 'classnames';

import { mdiArrowDown, mdiArrowUp } from '@lumx/icons';
import { Icon, Size } from '@lumx/react';
import type { ComponentClassName, GenericProps, ValueOf } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/react/utils/className';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

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
const CLASSNAME: ComponentClassName<'Table', typeof COMPONENT_NAME> = 'lumx-table__cell';

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
export const TableCell = forwardRef<TableCellProps, HTMLTableCellElement>((props, ref) => {
    const { children, className, icon, isSortable, onHeaderClick, sortOrder, variant, ...forwardedProps } = props;

    // Use button if clickable
    const Wrapper = onHeaderClick ? 'button' : 'div';
    const wrapperProps = Wrapper === 'button' ? ({ type: 'button', onClick: onHeaderClick } as const) : undefined;

    // ARIA sort
    let ariaSort: 'ascending' | 'descending' | 'none' | undefined;
    if (isSortable) {
        ariaSort = 'none';
        if (sortOrder === ThOrder.asc) ariaSort = 'ascending';
        if (sortOrder === ThOrder.desc) ariaSort = 'descending';
    }

    return (
        <>
            {variant === TableCellVariant.head && (
                <th
                    ref={ref}
                    {...forwardedProps}
                    className={classNames(
                        handleBasicClasses({
                            prefix: CLASSNAME,
                            isSortable,
                            isSorted: isSortable && !!sortOrder,
                        }),
                        className,
                        `${CLASSNAME}--head`,
                    )}
                    aria-sort={ariaSort}
                >
                    <Wrapper className={`${CLASSNAME}-wrapper`} {...wrapperProps}>
                        {icon && !isSortable && <Icon className={`${CLASSNAME}-icon`} icon={icon} size={Size.xxs} />}

                        {isSortable && sortOrder === ThOrder.asc && (
                            <Icon className={`${CLASSNAME}-icon`} icon={mdiArrowUp} size={Size.xxs} />
                        )}

                        {isSortable && sortOrder === ThOrder.desc && (
                            <Icon className={`${CLASSNAME}-icon`} icon={mdiArrowDown} size={Size.xxs} />
                        )}

                        <div className={`${CLASSNAME}-content`}>{children}</div>
                    </Wrapper>
                </th>
            )}

            {variant === TableCellVariant.body && (
                <td {...forwardedProps} className={classNames(className, CLASSNAME, `${CLASSNAME}--body`)}>
                    <div className={`${CLASSNAME}-content`}>{children}</div>
                </td>
            )}
        </>
    );
});
TableCell.displayName = COMPONENT_NAME;
TableCell.className = CLASSNAME;
TableCell.defaultProps = DEFAULT_PROPS;
