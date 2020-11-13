import { Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, ValueOf, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

/**
 * Defines the props of the component.
 */
interface InputLabelProps extends GenericProps {
    /** The children elements. */
    children: string | ReactNode;
    /** Whether the component is required or not. */
    isRequired?: boolean;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: ValueOf<Theme>;
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
    theme: Theme.light,
};

const InputLabel: React.FC<InputLabelProps> = ({ children, className, isRequired, theme, ...forwardedProps }) => (
    <label
        {...forwardedProps}
        className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, isRequired, theme }))}
    >
        {children}
    </label>
);

InputLabel.displayName = COMPONENT_NAME;
InputLabel.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, InputLabel, InputLabelProps };
