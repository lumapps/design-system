import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export type ListDividerProps = GenericProps;

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ListDivider';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * ListDivider component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ListDivider: Comp<ListDividerProps, HTMLLIElement> = forwardRef((props, ref) => {
    const { className, ...forwardedProps } = props;

    return (
        <li
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}
        />
    );
});
ListDivider.displayName = COMPONENT_NAME;
ListDivider.className = CLASSNAME;
