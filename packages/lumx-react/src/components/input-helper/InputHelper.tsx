import { Kind, Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { INPUT_HELPER_CONFIGURATION } from './constants';

/**
 * Defines the props of the component.
 */
interface InputHelperProps extends GenericProps {
    /** The children elements to be transcluded into the component. */
    children: string | ReactNode;
    /** The kind of helper (error or sucess for exemple). */
    kind?: Kind;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}InputHelper`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<InputHelperProps> = {
    kind: Kind.info,
    theme: Theme.light,
};

const InputHelper: React.FC<InputHelperProps> = ({
    children,
    className,
    kind = DEFAULT_PROPS.kind as Kind,
    theme = DEFAULT_PROPS.theme,
    ...forwardedProps
}) => {
    const { color } = INPUT_HELPER_CONFIGURATION[kind] || {};

    return (
        <span
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color, theme }))}
        >
            {children}
        </span>
    );
};

InputHelper.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, InputHelper, InputHelperProps };
