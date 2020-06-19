import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface ListDividerProps extends GenericProps {}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<ListDividerProps> {}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ListDivider`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: DefaultPropsType = {};

/**
 * Renders a thin line that will acts as a divider in List
 *
 * @return The component.
 */
const ListDivider: React.FC<ListDividerProps> = ({ className = '', ...forwardedProps }) => {
    return <li {...forwardedProps} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} />;
};
ListDivider.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, ListDivider, ListDividerProps };
