import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface ListSubheaderProps extends GenericProps {
    /** List sub header content. */
    children: string | ReactNode;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ListSubheader`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<ListSubheaderProps> = {};

/**
 * Component used in List to display some separator / title section.
 *
 * @return The component.
 */
export const ListSubheader: React.FC<ListSubheaderProps> = ({ children, className, ...props }) => {
    return (
        <li className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))} {...props}>
            {children}
        </li>
    );
};
ListSubheader.displayName = COMPONENT_NAME;
