import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Comp, GenericProps, getRootClassName } from '@lumx/react/utils';

/**
 * Defines the props of the component
 */
export type ButtonGroupProps = GenericProps;

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ButtonGroup';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ButtonGroupProps> = {};

/**
 * ButtonGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ButtonGroup: Comp<ButtonGroupProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { children, className, ...forwardedProps } = props;

    return (
        <div ref={ref} {...forwardedProps} className={classNames(className, CLASSNAME)}>
            {children}
        </div>
    );
});
ButtonGroup.displayName = COMPONENT_NAME;
ButtonGroup.className = CLASSNAME;
ButtonGroup.defaultProps = DEFAULT_PROPS;
