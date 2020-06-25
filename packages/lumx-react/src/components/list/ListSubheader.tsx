import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface ListSubheaderProps extends GenericProps {
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
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component used in List to display some separator / title section.
 *
 * @return The component.
 */
const ListSubheader: React.FC<ListSubheaderProps> = ({ children, className, ...forwardedProps }) => {
    return (
        <li {...forwardedProps} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}>
            {children}
        </li>
    );
};
ListSubheader.displayName = COMPONENT_NAME;

export { CLASSNAME, ListSubheader, ListSubheaderProps };
