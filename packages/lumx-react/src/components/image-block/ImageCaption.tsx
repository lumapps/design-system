import { CSSProperties } from 'react';

import { FlexBox, Text, TextProps, useTheme } from '@lumx/react';
import {
    As,
    ImageCaptionPropsToOverride,
    ImageCaption as UI,
    ImageCaptionProps as UIProps,
    ImageCaptionMetadata as UIMetadataProps,
} from '@lumx/core/js/components/ImageBlock/ImageCaption';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

type ForwardedTextProps = Omit<TextProps, 'as' | 'typography' | 'color' | 'colorVariant'>;

export type ImageCaptionMetadata = Omit<UIMetadataProps, ImageCaptionPropsToOverride> & {
    /** Props to pass to the title. */
    titleProps?: ForwardedTextProps;
    /** Props to pass to the title. */
    descriptionProps?: ForwardedTextProps;
    /** Caption custom CSS style. */
    captionStyle?: CSSProperties;
};

export type ImageCaptionProps<AS extends As = 'figcaption'> = ReactToJSX<UIProps<AS>, ImageCaptionPropsToOverride> &
    ImageCaptionMetadata & {
        /** Truncate text on title & description (no line wrapping). */
        truncate?: TextProps['truncate'];
    };

/** Internal component used to render image captions */
export const ImageCaption = <AS extends As>(props: ImageCaptionProps<AS>) => {
    const defaultTheme = useTheme();
    const { theme = defaultTheme, ...forwardedProps } = props;

    return UI({
        FlexBox,
        Text,
        theme,
        ...forwardedProps,
    });
};
