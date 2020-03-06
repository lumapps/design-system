import { Color, ColorPalette } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

/**
 * Defines the props of the component.
 */
export interface BaseBadgeProps extends GenericProps {
    /**
     * Badge content.
     */
    children?: ReactNode;

    /**
     * The badge color.
     */
    color?: Color;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Badge`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: BaseBadgeProps = {
    color: ColorPalette.light,
};

export const Badge: React.FC<BaseBadgeProps> = ({ color = DEFAULT_PROPS.color, className, children, ...props }) => {
    return (
        <div className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color }))} {...props}>
            {children}
        </div>
    );
};
Badge.displayName = COMPONENT_NAME;
