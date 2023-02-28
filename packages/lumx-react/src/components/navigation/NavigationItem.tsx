import React, { Children, ElementType, forwardRef, ReactNode, useState } from 'react';
import { Icon, Placement, Size, Theme, Tooltip, Text } from '@lumx/react';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { Comp } from '@lumx/react/utils/type';
import classNames from 'classnames';

export interface NavigationItemProps {
    /** Classname that will be used for the nav wrapping element */
    className?: string;
    /** Icon (SVG path). */
    icon?: string;
    /** Theme that will be applied to the element, either Theme.dark or Theme.light */
    theme?: Theme;
    /** Content of the navigation. These components should be of type NavigationItem to be rendered */
    children?: ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'NavigationItem';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

const NavigationItem: Comp<NavigationItemProps, HTMLLIElement> = forwardRef((props, ref) => {
    const { className, icon, theme, children, ...forwardedProps } = props;

    return (
        <li
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    theme,
                }),
            )}
            ref={ref}
            {...forwardedProps}
        >
            {children}
        </li>
    );
});

NavigationItem.displayName = COMPONENT_NAME;
NavigationItem.className = CLASSNAME;

export { NavigationItem };
