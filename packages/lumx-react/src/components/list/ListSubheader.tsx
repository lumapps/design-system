import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface ListSubheaderProps extends GenericProps {
    /** The children elements. */
    children: string | ReactNode;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ListSubheader`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

export const ListSubheader: Comp<ListSubheaderProps> = ({ children, className, ...forwardedProps }) => (
    <li {...forwardedProps} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}>
        {children}
    </li>
);
ListSubheader.displayName = COMPONENT_NAME;
ListSubheader.className = CLASSNAME;
