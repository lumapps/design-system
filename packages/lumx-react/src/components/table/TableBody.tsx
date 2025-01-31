import React from 'react';

import classNames from 'classnames';

import type { ComponentClassName, GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface TableBodyProps extends GenericProps {
    /** Children */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'TableBody';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: ComponentClassName<'Table', typeof COMPONENT_NAME> = 'lumx-table__body';

/**
 * TableBody component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TableBody = forwardRef<TableBodyProps, HTMLTableSectionElement>((props, ref) => {
    const { children, className, ...forwardedProps } = props;

    return (
        <tbody ref={ref} {...forwardedProps} className={classNames(className, CLASSNAME)}>
            {children}
        </tbody>
    );
});
TableBody.displayName = COMPONENT_NAME;
TableBody.className = CLASSNAME;
