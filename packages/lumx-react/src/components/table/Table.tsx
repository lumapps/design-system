import React from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface TableProps extends GenericProps {
    /**
     * Whether the table has checkbox or thumbnail on first cell.
     */
    hasBefore?: boolean;
    /**
     * Whether the table has dividers.
     */
    hasDividers?: boolean;
    /**
     * The theme.
     */
    theme?: Theme;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Table`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<TableProps> = {
    hasBefore: false,
    hasDividers: false,
    theme: Theme.light,
};

/**
 * The Table component displays an HTML table, composed by a Table-head and a Table-body with Table-cells in Table Rows.
 *
 * @return The component.
 */
export const Table: React.FC<TableProps> = ({
    children,
    className,
    hasBefore,
    hasDividers,
    theme = DEFAULT_PROPS.theme,
    ...props
}) => (
    <table
        className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, hasBefore, hasDividers, theme }))}
        {...props}
    >
        {children}
    </table>
);
Table.displayName = COMPONENT_NAME;
