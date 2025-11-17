import React from 'react';

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

import { GenericProps, HeadingElement, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/core/js/utils/className';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface LinkPreviewProps extends GenericProps, HasTheme {
    /** Description. */
    description?: string;
    /** Link URL. */
    link: string;
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** Props to pass to the link (minus those already set by the LinkPreview props). */
    linkProps?: Omit<LinkProps, 'color' | 'colorVariant' | 'href' | 'target'>;
    /** Size variant. */
    size?: Extract<Size, 'regular' | 'big'>;
    /** Thumbnail for the link preview. */
    thumbnailProps?: ThumbnailProps;
    /** Title. */
    title?: string;
    /** Customize the title heading tag. */
    titleHeading?: HeadingElement;
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
const DEFAULT_PROPS = {
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
export const LinkPreview = forwardRef<LinkPreviewProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        className,
        description,
        link,
        linkAs,
        linkProps,
        size = DEFAULT_PROPS.size,
        theme = defaultTheme,
        thumbnailProps,
        title,
        titleHeading = DEFAULT_PROPS.titleHeading,
        ...forwardedProps
    } = props;
    // Use title heading as title wrapper (see DEFAULT_PROPS for the default value).
    const TitleHeading = titleHeading as HeadingElement;

    return (
        <article
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

                <div className={`${CLASSNAME}__container`}>
                    {title && (
                        <TitleHeading className={`${CLASSNAME}__title`}>
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

                    {description && <p className={`${CLASSNAME}__description`}>{description}</p>}

                    <div className={`${CLASSNAME}__link`}>
                        <Link
                            {...linkProps}
                            linkAs={linkAs}
                            className={classNames(`${CLASSNAME}__link`, linkProps?.className)}
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
});

LinkPreview.displayName = COMPONENT_NAME;
LinkPreview.className = CLASSNAME;
LinkPreview.defaultProps = DEFAULT_PROPS;
