import React, { Children, forwardRef, ReactNode } from 'react';

import classNames from 'classnames';

import { SideNavigationItem, Theme } from '@lumx/react';

import { Comp, GenericProps, getRootClassName, handleBasicClasses, isComponent } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface SideNavigationProps extends GenericProps {
    /** SideNavigationItem elements. */
    children: ReactNode;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SideNavigation';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * SideNavigation component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SideNavigation: Comp<SideNavigationProps, HTMLUListElement> = forwardRef((props, ref) => {
    const { children, className, theme, ...forwardedProps } = props;
    const content = Children.toArray(children).filter(isComponent(SideNavigationItem));

    return (
        <ul
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                theme === Theme.dark && 'lumx-color-font-light-N',
                handleBasicClasses({ prefix: CLASSNAME }),
            )}
        >
            {content}
        </ul>
    );
});
SideNavigation.displayName = COMPONENT_NAME;
SideNavigation.className = CLASSNAME;
