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
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface LinkPreviewProps extends GenericProps {
    /** The url of the link. */
    link: string;
    /** Content text. Can be either a string, or sanitized html. */
    description?:
        | string
        | {
              __html: string;
          };
    /** The size variant of the web bookmark. */
    size?: Size.regular | Size.big;
    /** Theme. */
    theme?: Theme;
    /** Thumbnail image source */
    thumbnail?: string;
    /** The props to pass to the thumbnail, minus those already set by the LinkPreview props. */
    thumbnailProps?: Omit<ThumbnailProps, 'aspectRatio' | 'fillHeight' | 'image' | 'onClick' | 'role' | 'tabIndex'>;
    /** The props to pass to the link, minus those already set by the LinkPreview props. */
    linkProps?: Omit<LinkProps, 'color' | 'colorVariant' | 'href' | 'target'>;
    /** Link title */
    title?: string;
}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<LinkPreviewProps> {}

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
const DEFAULT_PROPS: DefaultPropsType = {
    size: Size.regular,
    theme: Theme.light,
    thumbnailProps: undefined,
    linkProps: undefined,
};

/**
 * LinkPreview Element that display a Lumapps post
 *
 * @return The component.
 */
const LinkPreview: React.FC<LinkPreviewProps> = ({
    className,
    title,
    description,
    link,
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
    thumbnail = '',
    thumbnailProps = DEFAULT_PROPS.thumbnailProps,
    linkProps = DEFAULT_PROPS.linkProps,
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

export { CLASSNAME, DEFAULT_PROPS, LinkPreview, LinkPreviewProps };
