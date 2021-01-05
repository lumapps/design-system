import React, { Children, forwardRef, ReactNode } from 'react';

import classNames from 'classnames';

import { SideNavigationItem, Theme } from '@lumx/react';

import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses, isComponent } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface SideNavigationProps extends GenericProps {
    /** SideNavigationItem elements. */
    children: ReactNode;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Whether custom colors are applied to this component or not. */
    useCustomColors?: boolean;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}SideNavigation`;

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
    const { children, className, theme, useCustomColors, ...forwardedProps } = props;
    const content = Children.toArray(children).filter(isComponent(SideNavigationItem));

    return (
        <ul
            ref={ref}
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
});
SideNavigation.displayName = COMPONENT_NAME;
SideNavigation.className = CLASSNAME;
