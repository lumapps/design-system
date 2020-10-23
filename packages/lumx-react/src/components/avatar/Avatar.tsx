import React, { CSSProperties, ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import { Size, Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, handleBasicClasses } from '@lumx/react/utils';
import { getRootClassName } from '../../utils/getRootClassName';

/**
 * Authorized size values.
 */
type AvatarSize = Size.xs | Size.s | Size.m | Size.l | Size.xl | Size.xxl;

/**
 * Defines the props of the component.
 */
interface AvatarProps extends GenericProps {
    /** Actions elements to be transcluded into the component */
    actions?: HTMLElement | ReactNode;
    /** Avatar badge */
    badge?: ReactElement;
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
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<AvatarProps> = {
    size: Size.m,
    theme: Theme.light,
};

/**
 * Simple component used to identify user.
 *
 * @return The component.
 */
const Avatar: React.FC<AvatarProps> = ({ actions, badge, className, size, theme, image, ...forwardedProps }) => {
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
Avatar.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Avatar, AvatarProps, AvatarSize };
