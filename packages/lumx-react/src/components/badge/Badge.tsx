import { Color, ColorPalette } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

/**
 * Defines the props of the component.
 */
export interface BadgeProps extends GenericProps {
    /** The children elements. */
    children?: ReactNode;
    /** The color variant of the component. */
    color?: Color;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Badge`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<BadgeProps> = {
    color: ColorPalette.primary,
};

export const Badge: Comp<BadgeProps> = ({ children, className, color, ...forwardedProps }) => {
    return (
        <div {...forwardedProps} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color }))}>
            {children}
        </div>
    );
};

Badge.displayName = COMPONENT_NAME;
Badge.className = CLASSNAME;
Badge.defaultProps = DEFAULT_PROPS;
