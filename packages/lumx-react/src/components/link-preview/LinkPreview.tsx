import React, { useCallback } from 'react';

import classNames from 'classnames';

import {
    AspectRatio,
    ColorPalette,
    ColorVariant,
    Link,
    LinkProps,
    Size,
    Theme,
    Thumbnail,
    ThumbnailProps,
} from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, ValueOf, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

type LinkPreviewSizes = Size.regular | Size.big;

/**
 * Defines the props of the component.
 */
interface LinkPreviewProps extends GenericProps {
    /** The text of the link. Can be either a string, or sanitized html. */
    description?: string | { __html: string };
    /**
     * The url of the link.
     * @see {@link LinkProps#image}
     */
    link: string;
    /** The props to pass to the link, minus those already set by the LinkPreview props. */
    linkProps?: Omit<LinkProps, 'color' | 'colorVariant' | 'href' | 'target'>;
    /** The size variant of the component. */
    size?: ValueOf<LinkPreviewSizes>;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: ValueOf<Theme>;
    /**
     * The image URL of the Thumbnail.
     * @see {@link ThumbnailProps#image}
     */
    thumbnail?: string;
    /** The props to pass to the thumbnail, minus those already set by the LinkPreview props. */
    thumbnailProps?: Omit<ThumbnailProps, 'aspectRatio' | 'fillHeight' | 'image' | 'onClick' | 'role' | 'tabIndex'>;
    /** The title of the link. */
    title?: string;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}LinkPreview`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<LinkPreviewProps> = {
    size: Size.regular,
    theme: Theme.light,
};

const LinkPreview: React.FC<LinkPreviewProps> = ({
    className,
    description,
    link,
    linkProps,
    size,
    theme,
    thumbnail = '',
    thumbnailProps,
    title,
    ...forwardedProps
}) => {
    const goToUrl = useCallback(() => window.open(link, '_blank'), [link]);

    return (
        <div
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    size: size === Size.big && thumbnail ? Size.big : Size.regular,
                    theme,
                }),
            )}
        >
            <div className={`${CLASSNAME}__wrapper`}>
                {thumbnail && (
                    <div className={`${CLASSNAME}__thumbnail`}>
                        <Thumbnail
                            {...thumbnailProps}
                            onClick={goToUrl}
                            role="link"
                            tabIndex={0}
                            image={thumbnail}
                            aspectRatio={AspectRatio.free}
                            fillHeight
                        />
                    </div>
                )}

                <div className={`${CLASSNAME}__container`}>
                    {title && (
                        <div className={`${CLASSNAME}__title`}>
                            <Link
                                {...linkProps}
                                target="_blank"
                                href={link}
                                color={theme === Theme.light ? ColorPalette.dark : ColorPalette.light}
                                colorVariant={ColorVariant.N}
                            >
                                {title}
                            </Link>
                        </div>
                    )}
                    {description && <p className={`${CLASSNAME}__description`}>{description}</p>}

                    <div className={`${CLASSNAME}__link`}>
                        <Link
                            {...linkProps}
                            className={classNames(`${CLASSNAME}__link`, linkProps?.className)}
                            target="_blank"
                            href={link}
                            color={theme === Theme.light ? ColorPalette.blue : ColorPalette.light}
                            colorVariant={ColorVariant.N}
                        >
                            {link}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

LinkPreview.displayName = COMPONENT_NAME;
LinkPreview.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, LinkPreview, LinkPreviewProps };
