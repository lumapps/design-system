import React, { forwardRef, KeyboardEventHandler, MouseEventHandler, ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import { AspectRatio, Size, Theme, Thumbnail, ThumbnailProps } from '@lumx/react';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Avatar sizes.
 */
export type AvatarSize = Extract<Size, 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'>;

/**
 * Defines the props of the component.
 */
export interface AvatarProps extends GenericProps {
    /** Action toolbar content. */
    actions?: ReactNode;
    /** Image alternative text. */
    alt: string;
    /** Badge. */
    badge?: ReactElement;
    /** Image URL. */
    image: string;
    /** On click callback. */
    onClick?: MouseEventHandler<HTMLDivElement>;
    /** On key press callback. */
    onKeyPress?: KeyboardEventHandler<HTMLDivElement>;
    /** Size variant. */
    size?: AvatarSize;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Props to pass to the thumbnail (minus those already set by the Avatar props). */
    thumbnailProps?: Omit<
        ThumbnailProps,
        'image' | 'alt' | 'size' | 'theme' | 'align' | 'fillHeight' | 'variant' | 'aspectRatio'
    >;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Avatar';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<AvatarProps> = {
    size: Size.m,
    theme: Theme.light,
};

/**
 * Avatar component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Avatar: Comp<AvatarProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        actions,
        alt,
        badge,
        className,
        image,
        onClick,
        onKeyPress,
        size,
        theme,
        thumbnailProps,
        ...forwardedProps
    } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, size, theme }))}
        >
            <Thumbnail
                className={`${CLASSNAME}__thumbnail`}
                onClick={onClick}
                onKeyPress={onKeyPress}
                {...thumbnailProps}
                aspectRatio={AspectRatio.square}
                size={size}
                image={image}
                alt={alt}
            />
            {actions && <div className={`${CLASSNAME}__actions`}>{actions}</div>}
            {badge && <div className={`${CLASSNAME}__badge`}>{badge}</div>}
        </div>
    );
});
Avatar.displayName = COMPONENT_NAME;
Avatar.className = CLASSNAME;
Avatar.defaultProps = DEFAULT_PROPS;
