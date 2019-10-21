import React, { CSSProperties, ReactElement } from 'react';

import classNames from 'classnames';

import { Size, Theme } from 'LumX';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/**
 * Authorized size values.
 */
type AvatarSize = Size.xs | Size.s | Size.m | Size.l | Size.xl | Size.xxl;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IAvatarProps extends IGenericProps {
    /* Size. */
    size?: AvatarSize;
    /* Theme. */
    theme?: Theme;
    /* Avatar image */
    image: string;
}
type AvatarProps = IAvatarProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<AvatarProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
const DEFAULT_PROPS: IDefaultPropsType = {
    hasActions: false,
    size: Size.m,
    theme: Theme.light,
};
/////////////////////////////

/**
 * Simple component used to identify user.
 *
 * @return The component.
 */
const Avatar: React.FC<AvatarProps> = ({
    actions,
    className = '',
    hasActions = DEFAULT_PROPS.hasActions,
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
    image,
    ...props
}: AvatarProps): ReactElement => {
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
            {hasActions && <div className={`${CLASSNAME}__actions`}>{actions}</div>}
        </div>
    );
};
Avatar.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Avatar, AvatarProps };
