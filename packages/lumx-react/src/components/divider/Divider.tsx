import React from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface DividerProps extends GenericProps {
    /**
     * The <Divider> theme.
     */
    theme?: Theme;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Divider`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<DividerProps> = {
    theme: Theme.light,
};

/**
 * Displays a divider.
 * This simply wraps a <hr> element.
 *
 * @return The component.
 */
export const Divider: React.FC<DividerProps> = ({ className, theme = DEFAULT_PROPS.theme, ...props }) => (
    <hr className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))} {...props} />
);
Divider.displayName = COMPONENT_NAME;
