import React, { forwardRef, Children, ReactElement, ReactNode } from 'react';
import classNames from 'classnames';
import { Comp, GenericProps, HasAriaLabelOrLabelledBy, isComponentType } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { Theme } from '@lumx/react';
import { NavigationSection } from '@lumx/react/components/navigation/NavigationSection';
import { NavigationButton } from '@lumx/react/components/navigation/NavigationButton';
import { NavigationLink } from '@lumx/react/components/navigation/NavigationLink';

export type NavigationProps = GenericProps &
      {
        /** Content of the navigation. These components should be of type NavigationItem to be rendered */
        children?: ReactNode;
        /** Classname that will be used for the nav wrapping element */
        className?: string;
        /** Theme that will be applied to the element, either Theme.dark or Theme.light */
        theme?: Theme;
    } & HasAriaLabelOrLabelledBy;

type BaseNavigation = Comp<NavigationProps>;

interface Navigation extends BaseNavigation {
    Section: typeof NavigationSection;
    Button: typeof NavigationButton;
    Link: typeof NavigationLink;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Navigation';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

const BaseNavigation: BaseNavigation = forwardRef(({ children, className, theme, ...forwardedProps }, ref) => {
    return (
        <nav
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
            <ul>{children}</ul>
        </nav>
    );
});
BaseNavigation.displayName = COMPONENT_NAME;
BaseNavigation.className = CLASSNAME;

export const Navigation: Navigation = Object.assign(BaseNavigation, {
    Section: NavigationSection,
    Button: NavigationButton,
    Link: NavigationLink,
});
