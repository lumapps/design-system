import { Alignment, HorizontalAlignment, Size } from '../../constants';
import type { CommonRef, HasClassName, JSXElement, LumxClassName, GenericProps, HasTheme, ValueOf } from '../../types';
import { classNames } from '../../utils';

import { ImageCaptionMetadata, ImageCaptionPropsToOverride } from './ImageCaption';

/**
 * Image block variants.
 */
export const ImageBlockCaptionPosition = {
    below: 'below',
    over: 'over',
} as const;
export type ImageBlockCaptionPosition = ValueOf<typeof ImageBlockCaptionPosition>;

/**
 *  Image block sizes.
 */
export type ImageBlockSize = Extract<Size, 'xl' | 'xxl'>;

/**
 * Defines the props of the component.
 */
export interface ImageBlockProps
    extends HasClassName,
        HasTheme,
        Omit<ImageCaptionMetadata, ImageCaptionPropsToOverride> {
    /** Action toolbar content. */
    actions?: JSXElement;
    /** Alignment. */
    align?: HorizontalAlignment;
    /** Image alternative text. */
    alt: string;
    /** Caption position. */
    captionPosition?: ImageBlockCaptionPosition;
    /** Whether the image has to fill its container height or not. */
    fillHeight?: boolean;
    /** Image URL. */
    image: string;
    /** Size variant. */
    size?: ImageBlockSize;
    /** Props to pass to the thumbnail (minus those already set by the ImageBlock props). */
    thumbnailProps?: GenericProps;
    /** reference to the root element */
    ref?: CommonRef;
    /** component for rendering the thumbnail */
    Thumbnail: any;
    /** component for rendering the image caption */
    ImageCaption: any;
}

export type ImageBlockPropsToOverride = 'Thumbnail' | 'ImageCaption' | 'thumbnailProps';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ImageBlock';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-image-block';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<ImageBlockProps> = {
    captionPosition: ImageBlockCaptionPosition.below,
    align: Alignment.left,
};

/**
 * ImageBlock component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ImageBlock = (props: ImageBlockProps) => {
    const {
        actions,
        align = DEFAULT_PROPS.align,
        alt,
        captionPosition = DEFAULT_PROPS.captionPosition,
        captionStyle,
        className,
        description,
        descriptionProps,
        fillHeight,
        image,
        size,
        tags,
        ref,
        theme,
        thumbnailProps,
        title,
        titleProps,
        Thumbnail,
        ImageCaption,
        ...forwardedProps
    } = props;
    return (
        <figure
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`caption-position-${captionPosition}`]: Boolean(captionPosition),
                    [`align-${align}`]: Boolean(align),
                    [`size-${size}`]: Boolean(size),
                    [`theme-${theme}`]: Boolean(theme),
                    'fill-height': fillHeight,
                }),
            )}
        >
            <Thumbnail
                {...thumbnailProps}
                className={classNames.join(element('image'), thumbnailProps?.className)}
                fillHeight={fillHeight}
                align={align}
                image={image}
                size={size}
                theme={theme}
                alt={(alt || title) as string}
            />
            <ImageCaption
                as="figcaption"
                baseClassName={CLASSNAME}
                theme={theme}
                title={title}
                titleProps={titleProps}
                description={description}
                descriptionProps={descriptionProps}
                tags={tags}
                captionStyle={captionStyle}
                align={align}
                truncate={captionPosition === 'over'}
            />
            {actions && <div className={element('actions')}>{actions}</div>}
        </figure>
    );
};
