import React, { KeyboardEventHandler, MouseEventHandler, ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import { AspectRatio, Size, Theme, Thumbnail, ThumbnailProps } from '@lumx/react';

import type { GenericProps, HasTheme, ComponentClassName } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/react/utils/className';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Avatar sizes.
 */
export type AvatarSize = Extract<Size, 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'>;

/**
 * Defines the props of the component.
 */
export interface AvatarProps extends GenericProps, HasTheme {
    /** Action toolbar content. */
    actions?: ReactNode;
    /** Image alternative text. */
    alt: string;
    /** Badge. */
    badge?: ReactElement;
    /** Image URL. */
    image: string;
    /** Props to pass to the link wrapping the thumbnail. */
    linkProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** On click callback. */
    onClick?: MouseEventHandler<HTMLDivElement>;
    /** On key press callback. */
    onKeyPress?: KeyboardEventHandler<HTMLDivElement>;
    /** Size variant. */
    size?: AvatarSize;
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
const CLASSNAME: ComponentClassName<typeof COMPONENT_NAME> = 'lumx-avatar';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<AvatarProps> = {
    size: Size.m,
};

/**
 * Avatar component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Avatar = forwardRef<AvatarProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        actions,
        alt,
        badge,
        className,
        image,
        linkProps,
        linkAs,
        onClick,
        onKeyPress,
        size,
        theme = defaultTheme,
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
                linkProps={linkProps}
                linkAs={linkAs}
                className={`${CLASSNAME}__thumbnail`}
                onClick={onClick}
                onKeyPress={onKeyPress}
                {...thumbnailProps}
                aspectRatio={AspectRatio.square}
                size={size}
                image={image}
                alt={alt}
                theme={theme}
            />
            {actions && <div className={`${CLASSNAME}__actions`}>{actions}</div>}
            {badge && <div className={`${CLASSNAME}__badge`}>{badge}</div>}
        </div>
    );
});
Avatar.displayName = COMPONENT_NAME;
Avatar.className = CLASSNAME;
Avatar.defaultProps = DEFAULT_PROPS;
