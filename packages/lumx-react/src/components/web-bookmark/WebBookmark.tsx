import React, { useCallback } from 'react';

import classNames from 'classnames';

import { Alignment, AspectRatio, ColorPalette, ColorVariant, Link, Size, Theme, Thumbnail } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IWebBookmarkProps extends IGenericProps {
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
type WebBookmarkProps = IWebBookmarkProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<WebBookmarkProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}WebBookmark`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    size: Size.regular,
    theme: Theme.light,
};
/////////////////////////////

/**
 * WebBookmark Element that display a Lumapps post
 *
 * @return The component.
 */
const WebBookmark: React.FC<WebBookmarkProps> = ({
    className,
    size = DEFAULT_PROPS.size,
    title,
    description,
    url,
    theme = DEFAULT_PROPS.theme,
    thumbnail = '',
}) => {
    const goToUrl = useCallback(() => window.open(url, '_blank'), [url]);

    return (
        <div className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme, size }))}>
            <div className={`${CLASSNAME}__thumbnail`}>
                <Thumbnail
                    onClick={goToUrl}
                    role="link"
                    tabIndex={0}
                    image={thumbnail}
                    align={Alignment.center}
                    aspectRatio={AspectRatio.horizontal}
                />
            </div>

            <div className={`${CLASSNAME}__infos`}>
                <Link
                    className={`${CLASSNAME}__title`}
                    target="_blank"
                    href={url}
                    color={theme === Theme.light ? ColorPalette.dark : ColorPalette.light}
                    colorVariant={ColorVariant.N}
                >
                    {title}
                </Link>
                <p className={`${CLASSNAME}__description`}>{description}</p>
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
    );
};

WebBookmark.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, WebBookmark, WebBookmarkProps };
