import React from 'react';

import classNames from 'classnames';

import type { GenericProps, ComponentClassName } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

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
const CLASSNAME: ComponentClassName<typeof COMPONENT_NAME> = 'lumx-button-group';

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
export const ButtonGroup = forwardRef<ButtonGroupProps, HTMLDivElement>((props, ref) => {
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
