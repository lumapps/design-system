import { Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { LabelHTMLAttributes, ReactNode } from 'react';

/**
 * Defines the props of the component.
 */
export interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    isRequired?: boolean;
    theme?: Theme;
    children: string | ReactNode;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}InputLabel`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<InputLabelProps> = {
    isRequired: false,
    theme: Theme.light,
};

export const InputLabel: React.FC<InputLabelProps> = ({
    className,
    isRequired = DEFAULT_PROPS.isRequired,
    theme = DEFAULT_PROPS.theme,
    htmlFor,
    children,
    ...props
}) => (
    <label
        {...props}
        className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, isRequired, theme }))}
        htmlFor={htmlFor}
    >
        {children}
    </label>
);
InputLabel.displayName = COMPONENT_NAME;
