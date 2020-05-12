import React, { useCallback } from 'react';

import classNames from 'classnames';

import { AspectRatio, ColorPalette, ColorVariant, Link, Size, Theme, Thumbnail } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface LinkPreviewProps extends GenericProps {
    /** The url of the link. */
    url: string;
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
    /** Active thumbnail cross origin. */
    isThumbnailCrossOriginEnabled?: boolean;
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
    url,
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
    thumbnail = '',
    isThumbnailCrossOriginEnabled = true,
}) => {
    const goToUrl = useCallback(() => window.open(url, '_blank'), [url]);

    return (
        <div
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
                            onClick={goToUrl}
                            role="link"
                            tabIndex={0}
                            image={thumbnail}
                            aspectRatio={AspectRatio.free}
                            fillHeight
                            isCrossOriginEnabled={isThumbnailCrossOriginEnabled}
                        />
                    </div>
                )}

                <div className={`${CLASSNAME}__container`}>
                    {title && (
                        <div className={`${CLASSNAME}__title`}>
                            <Link
                                target="_blank"
                                href={url}
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
                            className={`${CLASSNAME}__link`}
                            target="_blank"
                            href={url}
                            color={theme === Theme.light ? ColorPalette.blue : ColorPalette.light}
                            colorVariant={ColorVariant.N}
                        >
                            {url}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

LinkPreview.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, LinkPreview, LinkPreviewProps };
