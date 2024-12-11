import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { HasAriaLabelOrLabelledBy, HasClassName, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { Orientation, Theme } from '@lumx/react';
import { ThemeProvider, useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { NavigationSection } from './NavigationSection';
import { NavigationItem } from './NavigationItem';
import { NavigationContext } from './context';

export type NavigationProps = React.ComponentProps<'nav'> &
    HasClassName &
    HasTheme & {
        /** Content of the navigation. These components should be of type NavigationItem to be rendered */
        children?: ReactNode;
        orientation?: Orientation;
    } & HasAriaLabelOrLabelledBy;

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Navigation';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props
 */
const DEFAULT_PROPS = {
    orientation: Orientation.vertical,
};

export const Navigation = Object.assign(
    // eslint-disable-next-line react/display-name
    forwardRef<HTMLElement, NavigationProps>((props, ref) => {
        const defaultTheme = useTheme() || Theme.light;
        const { children, className, theme = defaultTheme, orientation, ...forwardedProps } = props;
        return (
            <ThemeProvider value={theme}>
                <nav
                    className={classNames(
                        className,
                        handleBasicClasses({
                            prefix: CLASSNAME,
                            theme,
                            orientation,
                        }),
                    )}
                    ref={ref}
                    {...forwardedProps}
                >
                    <NavigationContext.Provider value={{ orientation }}>
                        <ul className={`${CLASSNAME}__list`}>{children}</ul>
                    </NavigationContext.Provider>
                </nav>
            </ThemeProvider>
        );
    }),
    {
        displayName: COMPONENT_NAME,
        className: CLASSNAME,
        defaultProps: DEFAULT_PROPS,
        // Sub components
        Section: NavigationSection,
        Item: NavigationItem,
    },
);
