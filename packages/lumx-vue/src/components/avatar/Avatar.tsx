import { defineComponent, useAttrs } from 'vue';

import {
    Avatar as AvatarUI,
    type AvatarProps as UIProps,
    DEFAULT_PROPS,
    element,
    type AvatarSize,
} from '@lumx/core/js/components/Avatar';
import { AspectRatio } from '@lumx/core/js/constants';
import type { GenericProps, JSXElement } from '@lumx/core/js/types';

import { useTheme } from '../../composables/useTheme';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Thumbnail, type ThumbnailProps } from '../thumbnail';

export type { AvatarSize };

export type AvatarProps = VueToJSXProps<UIProps, 'image' | 'actions' | 'badge'> & {
    /** Image URL. */
    image: string;
    /** Image alternative text. */
    alt: string;
    /** Props to pass to the link wrapping the thumbnail. */
    linkProps?: GenericProps;
    /** Custom component for the link (can be used to inject vue-router RouterLink). */
    linkAs?: 'a' | any;
    /** Props to pass to the thumbnail (minus those already set by the Avatar props). */
    thumbnailProps?: Omit<ThumbnailProps, 'image' | 'alt' | 'size' | 'theme' | 'aspectRatio'>;
};

const Avatar = defineComponent(
    (props: AvatarProps, { slots }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        return () => {
            const {
                image,
                alt,
                size = DEFAULT_PROPS.size,
                theme,
                linkProps,
                linkAs,
                thumbnailProps,
                class: className,
            } = props;
            const resolvedTheme = theme || defaultTheme.value;

            // Extract event handlers from attrs to forward to Thumbnail (not to root div)
            const { onClick, onKeyPress, ...restAttrs } = { ...attrs } as any;

            const actionsContent = slots.actions?.() as JSXElement;
            const badgeContent = slots.badge?.() as JSXElement;

            return (
                <AvatarUI
                    {...restAttrs}
                    className={className}
                    theme={resolvedTheme}
                    size={size}
                    actions={actionsContent}
                    badge={badgeContent}
                    image={
                        <Thumbnail
                            linkProps={linkProps}
                            linkAs={linkAs}
                            class={element('thumbnail')}
                            onClick={onClick}
                            onKeyPress={onKeyPress}
                            {...thumbnailProps}
                            aspectRatio={AspectRatio.square}
                            size={size}
                            image={image}
                            alt={alt}
                            theme={resolvedTheme}
                        />
                    }
                />
            );
        };
    },
    {
        name: 'LumxAvatar',
        inheritAttrs: false,
        props: keysOf<AvatarProps>()('image', 'alt', 'size', 'theme', 'linkProps', 'linkAs', 'thumbnailProps', 'class'),
    },
);

export default Avatar;
