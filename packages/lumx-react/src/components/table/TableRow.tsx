import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface TableRowProps extends GenericProps {
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
export const CLASSNAME = getRootClassName(COMPONENT_NAME, true);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<TableRowProps> = {
    isClickable: false,
    isDisabled: false,
    isSelected: false,
};

/**
 * The TableRow component displays an HTML Table Row, which contains table cells.
 *
 * @return The component.
 */
export const TableRow: React.FC<TableRowProps> = ({
    children,
    className,
    isClickable = DEFAULT_PROPS.isClickable,
    isDisabled = DEFAULT_PROPS.isDisabled,
    isSelected = DEFAULT_PROPS.isSelected,
    ...props
}) => (
    <tr
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
        {...props}
    >
        {children}
    </tr>
);
TableRow.displayName = COMPONENT_NAME;
