import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export type TableBodyProps = GenericProps;

/**
 * Component display name.
 */
const COMPONENT_NAME = 'TableBody';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME, true);

/**
 * TableBody component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TableBody: Comp<TableBodyProps, HTMLTableSectionElement> = forwardRef((props, ref) => {
    const { children, className, ...forwardedProps } = props;

    return (
        <tbody
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}
        >
            {children}
        </tbody>
    );
});
TableBody.displayName = COMPONENT_NAME;
TableBody.className = CLASSNAME;
