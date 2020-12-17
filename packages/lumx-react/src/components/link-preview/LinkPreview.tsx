import React, { forwardRef, useCallback } from 'react';

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
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface LinkPreviewProps extends GenericProps {
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
    size?: Size.regular | Size.big;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** The thumbnail image for the link preview. */
    thumbnailProps?: ThumbnailProps;
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
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<LinkPreviewProps> = {
    size: Size.regular,
    theme: Theme.light,
};

/**
 * LinkPreview component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const LinkPreview: Comp<LinkPreviewProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { className, description, link, linkProps, size, theme, thumbnailProps, title, ...forwardedProps } = props;

    //TODO: a11y
    const goToUrl = useCallback(() => window.open(link, '_blank'), [link]);

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    size: size === Size.big && thumbnailProps ? Size.big : Size.regular,
                    theme,
                }),
            )}
        >
            <div className={`${CLASSNAME}__wrapper`}>
                {thumbnailProps && (
                    <div className={`${CLASSNAME}__thumbnail`}>
                        <Thumbnail
                            {...thumbnailProps}
                            onClick={goToUrl}
                            role="link"
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
});

LinkPreview.displayName = COMPONENT_NAME;
LinkPreview.className = CLASSNAME;
LinkPreview.defaultProps = DEFAULT_PROPS;
