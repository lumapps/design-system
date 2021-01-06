import { Theme } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { forwardRef, ReactNode } from 'react';

/**
 * Defines the props of the component.
 */
export interface InputLabelProps extends GenericProps {
    /** Label content. */
    children: string | ReactNode;
    /** Native htmlFor property. */
    htmlFor: string;
    /** Whether the component is required or not. */
    isRequired?: boolean;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
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
const DEFAULT_PROPS: Partial<InputLabelProps> = {
    theme: Theme.light,
};

/**
 * InputLabel component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const InputLabel: Comp<InputLabelProps, HTMLLabelElement> = forwardRef((props, ref) => {
    const { children, className, htmlFor, isRequired, theme, ...forwardedProps } = props;

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
