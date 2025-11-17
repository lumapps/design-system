import React from 'react';

import classNames from 'classnames';

import { GenericProps } from '@lumx/react/utils/type';
import { getRootClassName } from '@lumx/core/js/utils/className';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

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
export const ListDivider = forwardRef<ListDividerProps, HTMLLIElement>((props, ref) => {
    const { className, ...forwardedProps } = props;

    return <li ref={ref} {...forwardedProps} className={classNames(className, CLASSNAME)} />;
});
ListDivider.displayName = COMPONENT_NAME;
ListDivider.className = CLASSNAME;
