import React from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface DividerProps extends GenericProps {
    /**
     * The <Divider> theme.
     */
    theme?: Theme;
}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<DividerProps> {}

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
const DEFAULT_PROPS: DefaultPropsType = {
    theme: Theme.light,
};

/**
 * Displays a divider.
 * This simply wraps a <hr> element.
 *
 * @return The component.
 */
const Divider: React.FC<DividerProps> = ({ className, theme = DEFAULT_PROPS.theme, ...forwardedProps }) => {
    return (
        <hr {...forwardedProps} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))} />
    );
};
Divider.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, Divider, DividerProps };
