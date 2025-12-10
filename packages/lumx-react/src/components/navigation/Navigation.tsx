import { HasAriaLabelOrLabelledBy, HasClassName, HasTheme } from '@lumx/react/utils/type';
import { useClassnames } from '@lumx/react/utils';
import type { LumxClassName } from '@lumx/core/js/types';
import { Orientation, Theme } from '@lumx/react';
import { ThemeProvider, useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { NavigationSection } from './NavigationSection';
import { NavigationItem } from './NavigationItem';
import { NavigationContext } from './context';

export type NavigationProps = React.ComponentProps<'nav'> &
    HasClassName &
    HasTheme & {
        /** Content of the navigation. These components should be of type NavigationItem to be rendered */
        children?: React.ReactNode;
        orientation?: Orientation;
    } & HasAriaLabelOrLabelledBy;

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Navigation';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-navigation';

/**
 * Component default props
 */
const DEFAULT_PROPS = {
    orientation: Orientation.vertical,
};

type SubComponents = {
    Section: typeof NavigationSection;
    Item: typeof NavigationItem;
};

export const Navigation = forwardRef<NavigationProps, HTMLElement, SubComponents>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        children,
        className,
        theme = defaultTheme,
        orientation = DEFAULT_PROPS.orientation,
        ...forwardedProps
    } = props;
    const { block, element } = useClassnames(CLASSNAME);

    return (
        <ThemeProvider value={theme}>
            <nav
                className={block(
                    {
                        [`theme-${theme}`]: Boolean(theme),
                        [`orientation-${orientation}`]: Boolean(orientation),
                    },
                    className,
                )}
                ref={ref}
                {...forwardedProps}
            >
                <NavigationContext.Provider value={{ orientation }}>
                    <ul className={element('list')}>{children}</ul>
                </NavigationContext.Provider>
            </nav>
        </ThemeProvider>
    );
});
Navigation.displayName = COMPONENT_NAME;
Navigation.className = CLASSNAME;
Navigation.defaultProps = DEFAULT_PROPS;

// Sub components
Navigation.Section = NavigationSection;
Navigation.Item = NavigationItem;
