import { AspectRatio, ColorPalette, ColorVariant, Size, Theme } from '../../constants';
import type { CommonRef, HasClassName, LumxClassName, GenericProps, HasTheme } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props of the component.
 */
export interface LinkPreviewProps extends HasClassName, HasTheme {
    /** Description. */
    description?: string;
    /** Link URL. */
    link: string;
    /** Custom component for the link (can be used to inject a router Link). */
    linkAs?: 'a' | any;
    /** Props to pass to the link (minus those already set by the LinkPreview props). */
    linkProps?: GenericProps;
    /** Size variant. */
    size?: Extract<Size, 'regular' | 'big'>;
    /** Thumbnail for the link preview. */
    thumbnailProps?: GenericProps;
    /** Title. */
    title?: string;
    /** Ref forwarded to the root article element. */
    ref?: CommonRef;
    /** Heading element used to wrap the title. */
    TitleHeading: any;
    /** Link component injected by the framework wrapper. */
    Link: any;
    /** Thumbnail component injected by the framework wrapper. */
    Thumbnail: any;
}

export type LinkPreviewPropsToOverride = 'linkProps' | 'TitleHeading' | 'Link' | 'Thumbnail' | 'thumbnailProps';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'LinkPreview';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-link-preview';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS = {
    size: Size.regular,
    titleHeading: 'h2',
} as const;

/**
 * LinkPreview component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const LinkPreview = (props: LinkPreviewProps) => {
    const {
        className,
        description,
        link,
        linkAs,
        linkProps,
        size = DEFAULT_PROPS.size,
        theme,
        thumbnailProps,
        ref,
        title,
        TitleHeading,
        Link,
        Thumbnail,
        ...forwardedProps
    } = props;
    // Use title heading as title wrapper (see DEFAULT_PROPS for the default value).
    const adjustedSize = size === Size.big && thumbnailProps ? Size.big : Size.regular;

    return (
        <article
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`size-${adjustedSize}`]: Boolean(adjustedSize),
                    [`theme-${theme}`]: Boolean(theme),
                }),
            )}
        >
            <div className={element('wrapper')}>
                {thumbnailProps && (
                    <div className={element('thumbnail')}>
                        <Thumbnail
                            {...thumbnailProps}
                            linkAs={linkAs}
                            linkProps={{
                                ...linkProps,
                                href: link,
                                target: '_blank',
                                // Avoid redundant links in focus order
                                tabIndex: -1,
                            }}
                            aspectRatio={AspectRatio.free}
                            fillHeight
                        />
                    </div>
                )}

                <div className={element('container')}>
                    {title && (
                        <TitleHeading className={element('title')}>
                            <Link
                                {...linkProps}
                                linkAs={linkAs}
                                target="_blank"
                                href={link}
                                color={theme === Theme.light ? ColorPalette.dark : ColorPalette.light}
                                colorVariant={ColorVariant.N}
                            >
                                {title}
                            </Link>
                        </TitleHeading>
                    )}

                    {description && <p className={element('description')}>{description}</p>}

                    <div className={element('link')}>
                        <Link
                            {...linkProps}
                            linkAs={linkAs}
                            className={classNames.join(element('link'), linkProps?.className)}
                            target="_blank"
                            href={link}
                            color={theme === Theme.light ? ColorPalette.primary : ColorPalette.light}
                            colorVariant={ColorVariant.N}
                            // Avoid redundant links in focus order
                            tabIndex={title ? '-1' : undefined}
                        >
                            {link}
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
};
