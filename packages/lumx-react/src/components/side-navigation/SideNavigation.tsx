import React, { Children, ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import { SideNavigationItem, Theme } from '@lumx/react';

import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses, isComponent } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface ISideNavigationProps extends IGenericProps {
    /**  Side navigation content (should use `<SideNavigationItem>`). */
    children: ReactNode;

    /** Theme. */
    theme?: Theme;

    /** Whether custom colors are applied to this component. */
    useCustomColors?: boolean;
}
type SideNavigationProps = ISideNavigationProps;

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}SideNavigation`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

const SideNavigation: React.FC<ISideNavigationProps> = (props: ISideNavigationProps): ReactElement => {
    const { className, theme, children, useCustomColors, ...otherProps } = props;

    const content = Children.toArray(children).filter(isComponent(SideNavigationItem));
    return (
        <ul
            className={classNames(
                className,
                theme === Theme.dark && 'lumx-theme-color-light-N',
                handleBasicClasses({ prefix: CLASSNAME }),
                { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
            )}
            {...otherProps}
        >
            {content}
        </ul>
    );
};
SideNavigation.displayName = COMPONENT_NAME;

export { CLASSNAME, SideNavigation, SideNavigationProps };
