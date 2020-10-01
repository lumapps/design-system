import { Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

/**
 * Defines the props of the component.
 */
interface InputLabelProps extends GenericProps {
    /** The children elements to be transcluded into the component. */
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
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<InputLabelProps> = {
    isRequired: false,
    theme: Theme.light,
};

const InputLabel: React.FC<InputLabelProps> = ({
    children,
    className,
    isRequired = DEFAULT_PROPS.isRequired,
    theme = DEFAULT_PROPS.theme,
    ...forwardedProps
}) => (
    <label
        {...forwardedProps}
        className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, isRequired, theme }))}
    >
        {children}
    </label>
);

InputLabel.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, InputLabel, InputLabelProps };
