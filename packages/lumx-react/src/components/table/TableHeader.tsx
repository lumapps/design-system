import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export type TableHeaderProps = GenericProps;

/**
 * Component display name.
 */
const COMPONENT_NAME = 'TableHeader';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME, true);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<TableHeaderProps> = {};

/**
 * TableHeader component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TableHeader: Comp<TableHeaderProps, HTMLTableSectionElement> = forwardRef((props, ref) => {
    const { children, className, ...forwardedProps } = props;

    return (
        <thead
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}
        >
            {children}
        </thead>
    );
});
TableHeader.displayName = COMPONENT_NAME;
TableHeader.className = CLASSNAME;
TableHeader.defaultProps = DEFAULT_PROPS;
