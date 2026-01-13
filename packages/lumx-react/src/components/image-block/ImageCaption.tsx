import { CSSProperties, ReactNode } from 'react';

import { FlexBox, GenericProps, HasClassName, HorizontalAlignment, Text, TextProps, useTheme } from '@lumx/react';
import { HasPolymorphicAs, HasTheme } from '@lumx/react/utils/type';

type As = 'div' | 'figcaption';

type ForwardedTextProps = Omit<TextProps, 'as' | 'typography' | 'color' | 'colorVariant'>;

export type ImageCaptionMetadata = {
    /** Image title to display in the caption. */
    title?: string;
    /** Props to pass to the title. */
    titleProps?: ForwardedTextProps;
    /** Image description. Can be either a string, or sanitized html. */
    description?: string | { __html: string };
    /** Props to pass to the title. */
    descriptionProps?: ForwardedTextProps;
    /** Tag content. */
    tags?: ReactNode;
    /** Caption custom CSS style. */
    captionStyle?: CSSProperties;
};

export type ImageCaptionProps<AS extends As = 'figcaption'> = HasTheme &
    HasClassName &
    HasPolymorphicAs<AS> &
    ImageCaptionMetadata & {
        /** Alignment. */
        align?: HorizontalAlignment;
        /** Truncate text on title & description (no line wrapping). */
        truncate?: TextProps['truncate'];
        /** Forwarded caption props */
        captionProps?: GenericProps;
        /** Forwarded tags props */
        tagsProps?: GenericProps;
    };

/** Internal component used to render image captions */
export const ImageCaption = <AS extends As>(props: ImageCaptionProps<AS>) => {
    const defaultTheme = useTheme();
    const {
        className,
        theme = defaultTheme,
        as = 'figcaption',
        title,
        titleProps,
        description,
        descriptionProps,
        tags,
        tagsProps,
        captionStyle,
        captionProps,
        align,
        truncate,
    } = props;
    if (!title && !description && !tags) return null;

    const titleColor = { color: theme === 'dark' ? 'light' : 'dark' } as const;
    const baseColor = { color: theme === 'dark' ? 'light' : 'dark', colorVariant: 'L2' } as const;

    // Display description as string or HTML
    const descriptionContent =
        typeof description === 'string' ? { children: description } : { dangerouslySetInnerHTML: description };

    return (
        <FlexBox
            as={as}
            className={className}
            style={captionStyle}
            orientation="vertical"
            vAlign={align}
            hAlign={align === 'center' ? align : undefined}
            gap="regular"
        >
            {(title || description) && (
                <Text as="p" {...captionProps} truncate={truncate} {...baseColor}>
                    {title && (
                        <Text {...titleProps} as="span" typography="subtitle1" {...titleColor}>
                            {title}
                        </Text>
                    )}{' '}
                    {description && <Text {...descriptionProps} as="span" typography="body1" {...descriptionContent} />}
                </Text>
            )}
            {tags && (
                <FlexBox {...tagsProps} orientation="horizontal" vAlign={align}>
                    {tags}
                </FlexBox>
            )}
        </FlexBox>
    );
};
