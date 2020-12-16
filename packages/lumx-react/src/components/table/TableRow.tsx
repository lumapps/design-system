import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
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
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}TableRow`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME, true);

/**
 * The default value of props.
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
            tabIndex={isClickable && !isDisabled ? 0 : -1}
            aria-disabled={isDisabled}
        >
            {children}
        </tr>
    );
});

TableRow.displayName = COMPONENT_NAME;
TableRow.className = CLASSNAME;
TableRow.defaultProps = DEFAULT_PROPS;
