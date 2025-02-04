import React, { ReactNode } from 'react';

import classNames from 'classnames';

import type { GenericProps, ComponentClassName } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

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
const COMPONENT_NAME = 'ListSubheader';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: ComponentClassName<typeof COMPONENT_NAME> = 'lumx-list-subheader';

/**
 * ListSubheader component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ListSubheader = forwardRef<ListSubheaderProps, HTMLLIElement>((props, ref) => {
    const { children, className, ...forwardedProps } = props;

    return (
        <li ref={ref} {...forwardedProps} className={classNames(className, CLASSNAME)}>
            {children}
        </li>
    );
});
ListSubheader.displayName = COMPONENT_NAME;
ListSubheader.className = CLASSNAME;
