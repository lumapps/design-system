import React, { forwardRef, ReactNode } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface ListSubheaderProps extends GenericProps {
    /** Content. */
    children: string | ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ListSubheader`;

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * ListSubheader component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ListSubheader: Comp<ListSubheaderProps, HTMLLIElement> = forwardRef((props, ref) => {
    const { children, className, ...forwardedProps } = props;

    return (
        <li ref={ref} {...forwardedProps} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}>
            {children}
        </li>
    );
});
ListSubheader.displayName = COMPONENT_NAME;
ListSubheader.className = CLASSNAME;
