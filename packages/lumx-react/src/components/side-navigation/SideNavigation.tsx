import React, { Children, ReactNode } from 'react';

import classNames from 'classnames';

import { SideNavigationItem, Theme } from '@lumx/react';

import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses, isComponent } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface SideNavigationProps extends GenericProps {
    /**  Side navigation content (should use `<SideNavigationItem>`). */
    children: ReactNode;

    /** Theme. */
    theme?: Theme;

    /** Whether custom colors are applied to this component. */
    useCustomColors?: boolean;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}SideNavigation`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

export const SideNavigation: React.FC<SideNavigationProps> = (props) => {
    const { className, theme, children, useCustomColors, ...otherProps } = props;

    const content = Children.toArray(children).filter(isComponent(SideNavigationItem));
    return (
        <ul
            {...otherProps}
            role="menu"
            className={classNames(
                className,
                theme === Theme.dark && 'lumx-theme-color-light-N',
                handleBasicClasses({ prefix: CLASSNAME }),
                { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
            )}
        >
            {content}
        </ul>
    );
};
SideNavigation.displayName = COMPONENT_NAME;
