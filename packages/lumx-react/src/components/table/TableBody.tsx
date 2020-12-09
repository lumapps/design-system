import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

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
const CLASSNAME = getRootClassName(COMPONENT_NAME, true);

export const TableBody: Comp<TableBodyProps> = ({ children, className, ...forwardedProps }) => (
    <tbody {...forwardedProps} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}>
        {children}
    </tbody>
);
TableBody.displayName = COMPONENT_NAME;
TableBody.className = CLASSNAME;
