import React, { Children, ReactElement } from 'react';

import { SideNavigationItem, Theme } from 'LumX';
import { handleBasicClasses } from 'LumX/core/utils';
import { COMPONENT_PREFIX } from 'LumX/react/constants';
import { IGenericProps, getRootClassName, isComponent } from 'LumX/react/utils';
import classNames from 'classnames';

/**
 * Defines the props of the component.
 */
interface ISideNavigationProps extends IGenericProps {
    /**
     * Side navigation children.
     */
    children: SideNavigationItem | SideNavigationItem[];
    /**
     * Theme
     */
    theme?: Theme;
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

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<SideNavigationProps> = {};

const SideNavigation: React.FC<ISideNavigationProps> = (props: ISideNavigationProps): ReactElement => {
    const { className, theme, children, ...otherProps } = props;

    const content = Children.toArray(children).filter(isComponent(SideNavigationItem));
    return (
        <ul
            className={classNames(
                className,
                theme === Theme.dark && 'lumx-theme-color-light-N',
                handleBasicClasses({ prefix: CLASSNAME }),
            )}
            {...otherProps}
        >
            {content}
        </ul>
    );
};
SideNavigation.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, SideNavigation, SideNavigationProps };
