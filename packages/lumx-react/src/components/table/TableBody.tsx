import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export type TableBodyProps = GenericProps;

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}TableBody`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME, true);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<TableBodyProps> = {};

/**
 * The TableBody component displays an HTML Table Body, composed TableBody-cells in TableBody Rows.
 *
 * @return The component.
 */
export const TableBody: React.FC<TableBodyProps> = ({ children, className, ...props }) => (
    <tbody className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
        {children}
    </tbody>
);
TableBody.displayName = COMPONENT_NAME;
