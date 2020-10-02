import React from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface TableProps extends GenericProps {
    /** Whether the table has checkbox or thumbnail on first cell or not. */
    hasBefore?: boolean;
    /** Whether the table has dividers or not. */
    hasDividers?: boolean;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Table`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<TableProps> = {
    hasBefore: false,
    hasDividers: false,
    theme: Theme.light,
};

/**
 * The Table component displays an HTML table, composed by a Table-head and a Table-body with Table-cells in Table Rows.
 *
 * @return The component.
 */
const Table: React.FC<TableProps> = ({
    children,
    className,
    hasBefore = DEFAULT_PROPS.hasBefore,
    hasDividers = DEFAULT_PROPS.hasDividers,
    theme = DEFAULT_PROPS.theme,
    ...forwardedProps
}) => (
    <table
        {...forwardedProps}
        className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, hasBefore, hasDividers, theme }))}
    >
        {children}
    </table>
);

Table.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, Table, TableProps };
