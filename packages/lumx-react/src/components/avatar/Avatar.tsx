import React, { CSSProperties, ReactNode } from 'react';

import classNames from 'classnames';

import { Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, handleBasicClasses, getRootClassName } from '@lumx/react/utils';

/**
 * Authorized size values.
 */
export type AvatarSize = Size.xs | Size.s | Size.m | Size.l | Size.xl | Size.xxl;

/**
 * Defines the props of the component.
 */
export interface AvatarProps extends GenericProps {
    /** Actions elements to be transcluded into the component */
    actions?: HTMLElement | ReactNode;
    /** Size. */
    size?: AvatarSize;
    /** Theme. */
    theme?: Theme;
    /** Avatar image */
    image: string;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Avatar`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<AvatarProps> = {
    actions: undefined,
    size: Size.m,
    theme: Theme.light,
};

/**
 * Simple component used to identify user.
 *
 * @return The component.
 */
export const Avatar: React.FC<AvatarProps> = ({
    actions = DEFAULT_PROPS.actions,
    className,
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
    image,
    ...props
}) => {
    const style: CSSProperties = {
        backgroundImage: `url(${image})`,
    };
    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, size, variant: 'rounded', theme }),
            )}
            {...props}
            style={style}
        >
            {actions && <div className={`${CLASSNAME}__actions`}>{actions}</div>}
        </div>
    );
};
Avatar.displayName = COMPONENT_NAME;
