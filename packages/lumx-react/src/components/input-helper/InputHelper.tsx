import { Kind, Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { INPUT_HELPER_CONFIGURATION } from './constants';

/**
 * Defines the props of the component.
 */
export interface InputHelperProps extends GenericProps {
    children: string | ReactNode;
    kind?: Kind;
    theme?: Theme;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}InputHelper`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<InputHelperProps> = {
    kind: Kind.info,
    theme: Theme.light,
};

export const InputHelper: React.FC<InputHelperProps> = ({
    children,
    className,
    kind = DEFAULT_PROPS.kind as Kind,
    theme = DEFAULT_PROPS.theme,
    ...props
}) => {
    const { color } = INPUT_HELPER_CONFIGURATION[kind] || {};

    return (
        <span className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color, theme }))} {...props}>
            {children}
        </span>
    );
};
InputHelper.displayName = COMPONENT_NAME;
