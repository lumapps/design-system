import { mdiArrowDown, mdiArrowUp } from '@lumx/icons';
import type { JSXElement, HasClassName, CommonRef, ValueOf } from '../../types';
import { classNames } from '../../utils';
import { Size } from '../../constants';
import { Icon } from '../Icon';

import { CLASSNAME as TABLE_CLASSNAME } from './constants';

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
export interface TableCellProps extends HasClassName {
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
    /** Children */
    children?: JSXElement;
    /** reference to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'TableCell';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME = `${TABLE_CLASSNAME}__cell`;
const { block } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<TableCellProps> = {
    variant: TableCellVariant.body,
};

/**
 * TableCell component.
 *
 * @param  props Component props.
 * @return React element.
 */
export const TableCell = (props: TableCellProps) => {
    const {
        children,
        className,
        icon,
        isSortable,
        onHeaderClick,
        ref,
        sortOrder,
        variant = DEFAULT_PROPS.variant,
        ...forwardedProps
    } = props;

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
                    className={classNames.join(
                        className,
                        block({
                            'is-sortable': isSortable,
                            'is-sorted': isSortable && !!sortOrder,
                            head: true,
                        }),
                    )}
                    aria-sort={ariaSort}
                >
                    <Wrapper className={`${CLASSNAME}-wrapper`} {...wrapperProps}>
                        {icon && !isSortable && Icon({ className: `${CLASSNAME}-icon`, icon, size: Size.xxs })}

                        {isSortable &&
                            sortOrder === ThOrder.asc &&
                            Icon({ className: `${CLASSNAME}-icon`, icon: mdiArrowUp, size: Size.xxs })}

                        {isSortable &&
                            sortOrder === ThOrder.desc &&
                            Icon({ className: `${CLASSNAME}-icon`, icon: mdiArrowDown, size: Size.xxs })}

                        <div className={`${CLASSNAME}-content`}>{children}</div>
                    </Wrapper>
                </th>
            )}

            {variant === TableCellVariant.body && (
                <td ref={ref} {...forwardedProps} className={classNames.join(className, block({ body: true }))}>
                    <div className={`${CLASSNAME}-content`}>{children}</div>
                </td>
            )}
        </>
    );
};
