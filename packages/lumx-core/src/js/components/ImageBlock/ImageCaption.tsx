import { HorizontalAlignment } from '../../constants';
import { GenericProps, HasPolymorphicAs, HasTheme, JSXElement } from '../../types';
import { classNames } from '../../utils';

export type As = 'div' | 'figcaption';

export type ImageCaptionMetadata = {
    /** Image title to display in the caption. */
    title?: string;
    /** Props to pass to the title. */
    titleProps?: GenericProps;
    /** Image description. Can be either a string, ReactNode, or sanitized html object. */
    description?: JSXElement | { __html: string };
    /** Props to pass to the description. */
    descriptionProps?: GenericProps;
    /** Tag content. */
    tags?: JSXElement;
    /** Caption custom CSS style. */
    captionStyle?: GenericProps;
    /** Props to pass to the wrapper FlexBox element. */
    wrapperProps?: GenericProps;
    /** FlexBox component injected by the framework wrapper (React or Vue). */
    FlexBox: any;
    /** Text component injected by the framework wrapper (React or Vue). */
    Text: any;
};

export type ImageCaptionPropsToOverride = 'FlexBox' | 'Text' | 'wrapperProps';

export type ImageCaptionProps<AS extends As = 'figcaption'> = HasTheme &
    HasPolymorphicAs<AS> &
    ImageCaptionMetadata & {
        /** Base className for sub elements */
        baseClassName?: string;
        /** Alignment. */
        align?: HorizontalAlignment;
        /** Truncate text on title & description (no line wrapping). */
        truncate?: boolean;
    };

/** Internal component used to render image captions */
export const ImageCaption = <AS extends As>(props: ImageCaptionProps<AS>) => {
    const {
        baseClassName,
        theme,
        as = 'figcaption',
        title,
        titleProps,
        description,
        descriptionProps,
        tags,
        captionStyle,
        align,
        truncate,
        FlexBox,
        Text,
        wrapperProps = { vAlign: align, hAlign: align === 'center' ? align : undefined },
    } = props;

    if (!title && !description && !tags) return null;

    const titleColor = { color: theme === 'dark' ? 'light' : 'dark' } as const;
    const baseColor = { color: theme === 'dark' ? 'light' : 'dark', colorVariant: 'L2' } as const;

    return (
        <FlexBox
            as={as}
            className={classNames.join(baseClassName && `${baseClassName}__wrapper`)}
            style={captionStyle}
            orientation="vertical"
            gap="regular"
            {...wrapperProps}
        >
            {(title || description) && (
                <Text
                    as="p"
                    className={classNames.join(baseClassName && `${baseClassName}__caption`)}
                    truncate={truncate}
                    {...baseColor}
                >
                    {title && (
                        <Text
                            {...titleProps}
                            as="span"
                            className={classNames.join(
                                titleProps?.className,
                                baseClassName && `${baseClassName}__title`,
                            )}
                            typography="subtitle1"
                            {...titleColor}
                        >
                            {title}
                        </Text>
                    )}{' '}
                    {description &&
                        (typeof description === 'object' && '__html' in description ? (
                            <Text
                                {...descriptionProps}
                                as="span"
                                className={classNames.join(
                                    descriptionProps?.className,
                                    baseClassName && `${baseClassName}__description`,
                                )}
                                typography="body1"
                                dangerouslySetInnerHTML={description as { __html: string }}
                            />
                        ) : (
                            <Text
                                {...descriptionProps}
                                as="span"
                                className={classNames.join(
                                    descriptionProps?.className,
                                    baseClassName && `${baseClassName}__description`,
                                )}
                                typography="body1"
                            >
                                {description as any}
                            </Text>
                        ))}
                </Text>
            )}
            {tags && (
                <FlexBox
                    className={classNames.join(baseClassName && `${baseClassName}__tags`)}
                    orientation="horizontal"
                    vAlign={align}
                >
                    {tags}
                </FlexBox>
            )}
        </FlexBox>
    );
};
