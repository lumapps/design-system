import { Theme } from '@lumx/react';
import { Comp, GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import classNames from 'classnames';
import React, { forwardRef, ReactNode } from 'react';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

/**
 * Defines the props of the component.
 */
export interface InputLabelProps extends GenericProps, HasTheme {
    /** Label content. */
    children: string | ReactNode;
    /** Native htmlFor property. */
    htmlFor: string;
    /** Whether the component is required or not. */
    isRequired?: boolean;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'InputLabel';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<InputLabelProps> = {};

/**
 * InputLabel component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const InputLabel: Comp<InputLabelProps, HTMLLabelElement> = forwardRef((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { children, className, htmlFor, isRequired, theme = defaultTheme, ...forwardedProps } = props;

    return (
        <label
            ref={ref}
            {...forwardedProps}
            htmlFor={htmlFor}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, isRequired, theme }))}
        >
            {children}
        </label>
    );
});
InputLabel.displayName = COMPONENT_NAME;
InputLabel.className = CLASSNAME;
InputLabel.defaultProps = DEFAULT_PROPS;
