import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface TableHeaderProps extends GenericProps {}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}TableHeader`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME, true);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<TableHeaderProps> = {};

const TableHeader: React.FC<TableHeaderProps> = ({ children, className, ...forwardedProps }) => (
    <thead {...forwardedProps} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}>
        {children}
    </thead>
);

TableHeader.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, TableHeader, TableHeaderProps };
