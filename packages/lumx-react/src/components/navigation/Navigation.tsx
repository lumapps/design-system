import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { HasAriaLabelOrLabelledBy, HasClassName, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { Orientation } from '@lumx/react';
import { ThemeContext } from '@lumx/react/utils/ThemeContext';
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

export const Navigation = Object.assign(
    // eslint-disable-next-line react/display-name
    forwardRef<HTMLElement, NavigationProps>((props, ref) => {
        const { children, className, theme, orientation = Orientation.vertical, ...forwardedProps } = props;
        return (
            <ThemeContext.Provider value={theme}>
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
            </ThemeContext.Provider>
        );
    }),
    {
        displayName: COMPONENT_NAME,
        className: CLASSNAME,
        // Sub components
        Section: NavigationSection,
        Item: NavigationItem,
    },
);
