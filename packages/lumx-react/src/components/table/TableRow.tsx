import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface TableRowProps extends GenericProps {
    /** Whether the component is clickable or not. */
    isClickable?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Whether the component is selected or not. */
    isSelected?: boolean;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'TableRow';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME, true);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<TableRowProps> = {};

/**
 * TableRow component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TableRow: Comp<TableRowProps, HTMLTableRowElement> = forwardRef((props, ref) => {
    const { children, className, disabled, isClickable, isDisabled = disabled, isSelected, ...forwardedProps } = props;

    return (
        <tr
            ref={ref}
            tabIndex={isClickable && !isDisabled ? 0 : -1}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    isClickable: isClickable && !isDisabled,
                    isDisabled,
                    isSelected: isSelected && !isDisabled,
                    prefix: CLASSNAME,
                }),
            )}
            aria-disabled={isDisabled}
        >
            {children}
        </tr>
    );
});

TableRow.displayName = COMPONENT_NAME;
TableRow.className = CLASSNAME;
TableRow.defaultProps = DEFAULT_PROPS;
