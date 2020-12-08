import React, { CSSProperties, ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import { Size, Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Authorized size values.
 */
export type AvatarSize = Size.xs | Size.s | Size.m | Size.l | Size.xl | Size.xxl;

/**
 * Defines the props of the component.
 */
export interface AvatarProps extends GenericProps {
    /** The action elements. */
    actions?: HTMLElement | ReactNode;
    /** The optional avatar badge. */
    badge?: ReactElement;
    /** The avatar image URL. */
    image: string;
    /** The size variant of the component. */
    size?: AvatarSize;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Avatar`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<AvatarProps> = {
    size: Size.m,
    theme: Theme.light,
};

export const Avatar: Comp<AvatarProps> = ({ actions, badge, className, image, size, theme, ...forwardedProps }) => {
    const style: CSSProperties = {
        backgroundImage: `url(${image})`,
    };
    return (
        <div
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, size, variant: 'rounded', theme }),
            )}
            style={style}
        >
            {actions && <div className={`${CLASSNAME}__actions`}>{actions}</div>}
            {badge && <div className={`${CLASSNAME}__badge`}>{badge}</div>}
        </div>
    );
};
Avatar.displayName = COMPONENT_NAME;
Avatar.className = CLASSNAME;
Avatar.defaultProps = DEFAULT_PROPS;
