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

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface LinkPreviewProps extends GenericProps {
    /** Description (either a string, or sanitized html). */
    description?: string | { __html: string };
    /** Link URL. */
    link: string;
    /** Props to pass to the link (minus those already set by the LinkPreview props). */
    linkProps?: Omit<LinkProps, 'color' | 'colorVariant' | 'href' | 'target'>;
    /** Size variant. */
    size?: Extract<Size, 'regular' | 'big'>;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Thumbnail for the link preview. */
    thumbnailProps?: ThumbnailProps;
    /** Title. */
    title?: string;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'LinkPreview';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
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
