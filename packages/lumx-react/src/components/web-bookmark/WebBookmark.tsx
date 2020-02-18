import React from 'react';

import classNames from 'classnames';

import { AspectRatio, Theme, Thumbnail } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { Alignment, Size } from '..';

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
    return (
        <a
            target="_blank"
            href={url}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme, size }))}
        >
            <div className={`${CLASSNAME}__thumbnail`}>
                <Thumbnail image={thumbnail} align={Alignment.center} aspectRatio={AspectRatio.horizontal} />
            </div>

            <div className={`${CLASSNAME}__infos`}>
                <p className={`${CLASSNAME}__title`}>{title}</p>
                <p className={`${CLASSNAME}__description`}>{description}</p>
                <p className={`${CLASSNAME}__link`}>{url}</p>
            </div>
        </a>
    );
};

WebBookmark.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, WebBookmark, WebBookmarkProps };
