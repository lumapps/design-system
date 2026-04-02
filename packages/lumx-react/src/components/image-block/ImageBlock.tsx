import { Size, Theme, Thumbnail } from '@lumx/react';

import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import {
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    ImageBlock as UI,
    ImageBlockProps as UIProps,
    ImageBlockPropsToOverride,
} from '@lumx/core/js/components/ImageBlock';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { ThumbnailProps } from '../thumbnail/Thumbnail';
import { ImageCaption } from './ImageCaption';

/**
 * Image block variants.
 */
export { ImageBlockCaptionPosition } from '@lumx/core/js/components/ImageBlock';

/**
 *  Image block sizes.
 */
export type ImageBlockSize = Extract<Size, 'xl' | 'xxl'>;

/**
 * Defines the props of the component.
 */
export interface ImageBlockProps extends GenericProps, ReactToJSX<UIProps, ImageBlockPropsToOverride> {
    /** Props to pass to the thumbnail (minus those already set by the ImageBlock props). */
    thumbnailProps?: Omit<ThumbnailProps, 'image' | 'size' | 'theme' | 'align' | 'fillHeight'>;
}

/**
 * ImageBlock component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ImageBlock = forwardRef<ImageBlockProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { theme = defaultTheme, ...forwardedProps } = props;

    return UI({
        ref,
        theme,
        ...forwardedProps,
        Thumbnail,
        ImageCaption,
    });
});

ImageBlock.displayName = COMPONENT_NAME;
ImageBlock.className = CLASSNAME;
ImageBlock.defaultProps = DEFAULT_PROPS;
