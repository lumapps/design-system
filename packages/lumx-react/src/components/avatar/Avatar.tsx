import { KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';

import { AspectRatio, Theme, Thumbnail, ThumbnailProps } from '@lumx/react';

import { GenericProps } from '@lumx/react/utils/type';
import {
    Avatar as UI,
    AvatarProps as UIProps,
    AvatarSize,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    element,
} from '@lumx/core/js/components/Avatar';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Avatar sizes.
 */
export type { AvatarSize };

/**
 * Defines the props of the component.
 */
export interface AvatarProps extends GenericProps, ReactToJSX<UIProps, 'actions' | 'badge' | 'image'> {
    /** Action toolbar content. */
    actions?: ReactNode;
    /** Props to pass to the link wrapping the thumbnail. */
    linkProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** On click callback. */
    onClick?: MouseEventHandler<HTMLDivElement>;
    /** On key press callback. */
    onKeyPress?: KeyboardEventHandler<HTMLDivElement>;
    /** Image alternative text. */
    alt: string;
    /** Props to pass to the thumbnail (minus those already set by the Avatar props). */
    thumbnailProps?: Omit<
        ThumbnailProps,
        'image' | 'alt' | 'size' | 'theme' | 'align' | 'fillHeight' | 'variant' | 'aspectRatio'
    >;
}

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
        size = DEFAULT_PROPS.size,
        theme = defaultTheme,
        thumbnailProps,
        ...forwardedProps
    } = props;

    return UI({
        ...forwardedProps,
        className,
        theme,
        ref,
        actions,
        badge,
        size,
        image: (
            <Thumbnail
                linkProps={linkProps}
                linkAs={linkAs}
                className={element('thumbnail')}
                onClick={onClick}
                onKeyPress={onKeyPress}
                {...thumbnailProps}
                aspectRatio={AspectRatio.square}
                size={size}
                image={image}
                alt={alt}
                theme={theme}
            />
        ),
    });
});

Avatar.displayName = COMPONENT_NAME;
Avatar.className = CLASSNAME;
Avatar.defaultProps = DEFAULT_PROPS;
