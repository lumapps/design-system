import React, { useCallback } from 'react';

import classNames from 'classnames';

import { AspectRatio, ColorPalette, ColorVariant, Link, Size, Theme, Thumbnail } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface WebBookmarkProps extends GenericProps {
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
    /** Link title */
    title?: string;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}WebBookmark`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<WebBookmarkProps> = {
    size: Size.regular,
    theme: Theme.light,
};

/**
 * WebBookmark Element that display a Lumapps post
 *
 * @return The component.
 */
export const WebBookmark: React.FC<WebBookmarkProps> = ({
    className,
    title,
    description,
    url,
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
    thumbnail = '',
}) => {
    const goToUrl = useCallback(() => window.open(url, '_blank'), [url]);

    return (
        <div className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, size, theme }))}>
            <div className={`${CLASSNAME}__wrapper`}>
                <div className={`${CLASSNAME}__thumbnail`}>
                    <Thumbnail
                        onClick={goToUrl}
                        role="link"
                        tabIndex={0}
                        image={thumbnail}
                        aspectRatio={AspectRatio.free}
                        fillHeight
                    />
                </div>

                <div className={`${CLASSNAME}__container`}>
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

                    <p className={`${CLASSNAME}__description`}>{description}</p>

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
WebBookmark.displayName = COMPONENT_NAME;
