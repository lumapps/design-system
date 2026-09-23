import { ReactNode } from 'react';

import { Theme } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';
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

    return (
        <ul
            ref={ref}
            {...forwardedProps}
            className={classNames.join(className, theme === Theme.dark && 'lumx-color-font-light-N', CLASSNAME)}
        >
            {children}
        </ul>
    );
});
SideNavigation.displayName = COMPONENT_NAME;
SideNavigation.className = CLASSNAME;
