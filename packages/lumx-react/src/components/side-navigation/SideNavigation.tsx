import { Children, ReactNode } from 'react';

import { SideNavigationItem, Theme } from '@lumx/react';
import { GenericProps, HasTheme, isComponent } from '@lumx/react/utils/type';
import { classNames } from '@lumx/core/js/utils';
import { useClassnames } from '@lumx/react/utils';
import type { LumxClassName } from '@lumx/core/js/types';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface SideNavigationProps extends GenericProps, HasTheme {
    /** SideNavigationItem elements. */
    children: ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SideNavigation';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-side-navigation';

/**
 * SideNavigation component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SideNavigation = forwardRef<SideNavigationProps, HTMLUListElement>((props, ref) => {
    const defaultTheme = useTheme();
    const { children, className, theme = defaultTheme, ...forwardedProps } = props;
    const { block } = useClassnames(CLASSNAME);
    const content = Children.toArray(children).filter(isComponent(SideNavigationItem));

    return (
        <ul
            ref={ref}
            {...forwardedProps}
            className={block([className, theme === Theme.dark && classNames.font('light')])}
        >
            {content}
        </ul>
    );
});
SideNavigation.displayName = COMPONENT_NAME;
SideNavigation.className = CLASSNAME;
