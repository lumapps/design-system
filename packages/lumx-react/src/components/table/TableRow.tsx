import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface TableRowProps extends GenericProps {
    /**
     * Whether the table row is clickable.
     */
    isClickable?: boolean;
    /**
     * Whether the table row is disabled.
     */
    isDisabled?: boolean;
    /**
     * Whether the table row is selected.
     */
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

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<TableRowProps> = {};

/**
 * The TableRow component displays an HTML Table Row, which contains table cells.
 *
 * @return The component.
 */
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
TableRow.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, TableRow, TableRowProps };
