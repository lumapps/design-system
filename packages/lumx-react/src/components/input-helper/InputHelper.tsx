import { Kind, Theme } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses, HasTheme } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { forwardRef, ReactNode } from 'react';

import { INPUT_HELPER_CONFIGURATION } from './constants';

/**
 * Defines the props of the component.
 */
export interface InputHelperProps extends GenericProps, HasTheme {
    /** Helper content. */
    children: string | ReactNode;
    /** Helper variant. */
    kind?: Kind;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'InputHelper';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<InputHelperProps> = {
    kind: Kind.info,
    theme: Theme.light,
};

/**
 * InputHelper component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const InputHelper: Comp<InputHelperProps, HTMLSpanElement> = forwardRef((props, ref) => {
    const { children, className, kind, theme, ...forwardedProps } = props;
    const { color } = INPUT_HELPER_CONFIGURATION[kind as any] || {};

    return (
        <span
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color, theme }))}
        >
            {children}
        </span>
    );
});

InputHelper.displayName = COMPONENT_NAME;
InputHelper.className = CLASSNAME;
InputHelper.defaultProps = DEFAULT_PROPS;
