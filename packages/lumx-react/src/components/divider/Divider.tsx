import React from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface DividerProps extends GenericProps {
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Divider`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<DividerProps> = {
    theme: Theme.light,
};

const Divider: React.FC<DividerProps> = ({ className, theme, ...forwardedProps }) => (
    <hr {...forwardedProps} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))} />
);
Divider.displayName = COMPONENT_NAME;
Divider.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Divider, DividerProps };
