import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface TableProps extends GenericProps {
    /** Whether the table has checkbox or thumbnail on first cell or not. */
    hasBefore?: boolean;
    /** Whether the table has dividers or not. */
    hasDividers?: boolean;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
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
const DEFAULT_PROPS: Partial<TableProps> = {
    theme: Theme.light,
};

/**
 * Table component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Table: Comp<TableProps, HTMLTableElement> = forwardRef((props, ref) => {
    const { children, className, hasBefore, hasDividers, theme, ...forwardedProps } = props;

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
