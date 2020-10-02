import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface TableBodyProps extends GenericProps {}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}TableBody`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME, true);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<TableBodyProps> = {};

const TableBody: React.FC<TableBodyProps> = ({ children, className, ...forwardedProps }) => (
    <tbody {...forwardedProps} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}>
        {children}
    </tbody>
);

TableBody.displayName = COMPONENT_NAME;
TableBody.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, TableBody, TableBodyProps };
