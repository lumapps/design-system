import React, { Children, ReactNode } from 'react';

import classNames from 'classnames';

import { SideNavigationItem, Theme } from '@lumx/react';

import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses, isComponent } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface SideNavigationProps extends GenericProps {
    /** The children elements. Should use SideNavigationItem. */
    children: ReactNode;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** Whether custom colors are applied to this component or not. */
    useCustomColors?: boolean;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}SideNavigation`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

const SideNavigation: React.FC<SideNavigationProps> = ({
    children,
    className,
    theme,
    useCustomColors,
    ...forwardedProps
}) => {
    const content = Children.toArray(children).filter(isComponent(SideNavigationItem));
    return (
        <ul
            {...forwardedProps}
            className={classNames(
                className,
                theme === Theme.dark && 'lumx-color-font-light-N',
                handleBasicClasses({ prefix: CLASSNAME }),
                { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
            )}
        >
            {content}
        </ul>
    );
};
SideNavigation.displayName = COMPONENT_NAME;

export { CLASSNAME, SideNavigation, SideNavigationProps };
