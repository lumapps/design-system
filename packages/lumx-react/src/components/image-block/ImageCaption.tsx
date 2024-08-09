import React, { CSSProperties, ReactNode } from 'react';

import { FlexBox, HorizontalAlignment, Text } from '@lumx/react';
import { HasClassName, HasPolymorphicAs, HasTheme } from '@lumx/react/utils/type';

type As = 'div' | 'figcaption';

export type ImageCaptionMetadata = {
    /** Image title to display in the caption. */
    title?: string;
    /** Image description. Can be either a string, or sanitized html. */
    description?: string | { __html: string };
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
        /** Truncate title & description */
        truncate?: boolean;
    };

/** Internal component used to render image captions */
export const ImageCaption = <AS extends As>(props: ImageCaptionProps<AS>) => {
    const { className, theme, as = 'figcaption', title, description, tags, captionStyle, align, truncate } = props;
    if (!title && !description && !tags) return null;

    const titleColor = { color: theme === 'dark' ? 'light' : 'dark' } as const;
    const descriptionColor = { color: theme === 'dark' ? 'light' : 'dark', colorVariant: 'L2' } as const;

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
                <Text as="p" truncate={truncate}>
                    {title && (
                        <Text as="span" typography="subtitle1" {...titleColor}>
                            {title}
                        </Text>
                    )}{' '}
                    {description && <Text as="span" typography="body1" {...descriptionColor} {...descriptionContent} />}
                </Text>
            )}
            {tags && (
                <FlexBox orientation="horizontal" vAlign={align}>
                    {tags}
                </FlexBox>
            )}
        </FlexBox>
    );
};
