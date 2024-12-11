import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';

import { Comp, GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

/**
 * Defines the props of the component.
 */
export interface TableProps extends GenericProps, HasTheme {
    /** Whether the table has checkbox or thumbnail on first cell or not. */
    hasBefore?: boolean;
    /** Whether the table has dividers or not. */
    hasDividers?: boolean;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Table';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<TableProps> = {};

/**
 * Table component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Table: Comp<TableProps, HTMLTableElement> = forwardRef((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { children, className, hasBefore, hasDividers, theme = defaultTheme, ...forwardedProps } = props;

    return (
        <table
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, hasBefore, hasDividers, theme }))}
        >
            {children}
        </table>
    );
});
Table.displayName = COMPONENT_NAME;
Table.className = CLASSNAME;
Table.defaultProps = DEFAULT_PROPS;
