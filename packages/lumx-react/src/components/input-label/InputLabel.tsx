import { Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

/**
 * Defines the props of the component.
 */
interface InputLabelProps extends GenericProps {
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
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<InputLabelProps> = {
    theme: Theme.light,
};

const InputLabel: React.FC<InputLabelProps> = ({ className, isRequired, theme, children, ...forwardedProps }) => (
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
