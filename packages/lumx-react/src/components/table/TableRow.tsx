import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface TableRowProps extends GenericProps {
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
const CLASSNAME: string = getRootClassName(COMPONENT_NAME, true);

const TableRow: React.FC<TableRowProps> = ({
    children,
    className,
    disabled,
    isClickable,
    isDisabled = disabled,
    isSelected,
    ...forwardedProps
}) => (
    <tr
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

TableRow.displayName = COMPONENT_NAME;

export { CLASSNAME, TableRow, TableRowProps };
