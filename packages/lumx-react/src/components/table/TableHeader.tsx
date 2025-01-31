import React from 'react';

import classNames from 'classnames';

import type { ComponentClassName, GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

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
const CLASSNAME: ComponentClassName<'Table', typeof COMPONENT_NAME> = 'lumx-table__header';

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
export const TableHeader = forwardRef<TableHeaderProps, HTMLTableSectionElement>((props, ref) => {
    const { children, className, ...forwardedProps } = props;

    return (
        <thead ref={ref} {...forwardedProps} className={classNames(className, CLASSNAME)}>
            {children}
        </thead>
    );
});
TableHeader.displayName = COMPONENT_NAME;
TableHeader.className = CLASSNAME;
TableHeader.defaultProps = DEFAULT_PROPS;
