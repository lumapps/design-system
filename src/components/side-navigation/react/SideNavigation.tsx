import { SideNavigationItem } from 'LumX';
import { handleBasicClasses } from 'LumX/core/utils';
import { COMPONENT_PREFIX } from 'LumX/react/constants';
import { IGenericProps, getRootClassName, isComponent } from 'LumX/react/utils';
import classNames from 'classnames';
import { castArray } from 'lodash';
import React, {  ReactElement } from 'react';

/**
 * Defines the props of the component.
 */
interface ISideNavigationProps extends IGenericProps {
    /**
     * Side navigation children.
     */
    children: SideNavigationItem | SideNavigationItem[];
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
    const { className, children, ...otherProps } = props;

    const content = castArray(children).filter(isComponent(SideNavigationItem));
    return (
        <ul className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...otherProps}>
            {content}
        </ul>
    );
};
SideNavigation.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, SideNavigation, SideNavigationProps };
