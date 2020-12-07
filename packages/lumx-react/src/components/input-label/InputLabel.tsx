import { Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

/**
 * Defines the props of the component.
 */
export interface InputLabelProps extends GenericProps {
    /** The children elements. */
    children: string | ReactNode;
    /** Whether the component is required or not. */
    isRequired?: boolean;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
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
const DEFAULT_PROPS: Partial<InputLabelProps> = {
    theme: Theme.light,
};

export const InputLabel: React.FC<InputLabelProps> = ({
    children,
    className,
    isRequired,
    theme,
    ...forwardedProps
}) => (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
        {...forwardedProps}
        className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, isRequired, theme }))}
    >
        {children}
    </label>
);

InputLabel.displayName = COMPONENT_NAME;
InputLabel.defaultProps = DEFAULT_PROPS;
