import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export type TableHeaderProps = GenericProps;

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}TableHeader`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME, true);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<TableHeaderProps> = {};

/**
 * The TableHeader component displays an HTML Table Head, composed TableHeader-cells in TableHeader Rows.
 *
 * @return The component.
 */
export const TableHeader: React.FC<TableHeaderProps> = ({ children, className, ...props }) => (
    <thead className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
        {children}
    </thead>
);
TableHeader.displayName = COMPONENT_NAME;
