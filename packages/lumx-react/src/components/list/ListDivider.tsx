import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface ListDividerProps extends GenericProps {}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ListDivider`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

const ListDivider: React.FC<ListDividerProps> = ({ className, ...forwardedProps }) => (
    <li {...forwardedProps} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} />
);
ListDivider.displayName = COMPONENT_NAME;

export { CLASSNAME, ListDivider, ListDividerProps };
