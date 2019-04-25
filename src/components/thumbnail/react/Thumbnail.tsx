import React, { CSSProperties } from 'react';

import classNames from 'classnames';

import { Theme, Themes } from 'LumX/components';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/**
 * All available aspect ratios.
 */
const enum AspectRatios {
    original = 'original',
    horizontal = 'horizontal',
    vertical = 'vertical',
}
type AspectRatio = AspectRatios;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IThumbnailProps extends IGenericProps {
    /* The image aspect ratio. */
    aspectRatio?: AspectRatio;
    /* Theme. */
    theme?: Theme;
    /* Avatar image */
    image: string;
}
type ThumbnailProps = IThumbnailProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<ThumbnailProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}Thumbnail`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    aspectRatio: AspectRatios.original,
    theme: Themes.light,
};
/////////////////////////////

/**
 * Simple component used to display image with square or round shape.
 * Convenient to display image previews or user avatar.
 *
 * @return {React.ReactElement} The component.
 */
const Thumbnail: React.FC<ThumbnailProps> = ({
    className = '',
    aspectRatio = DEFAULT_PROPS.aspectRatio,
    theme = DEFAULT_PROPS.theme,
    image,
    ...props
}: ThumbnailProps): React.ReactElement => {
    const style: CSSProperties = {
        backgroundImage: `url(${image})`,
    };

    const { alt = 'Thumbnail' }: IDefaultPropsType = props;

    return (
        <div
            className={classNames(className, handleBasicClasses({ aspectRatio, prefix: CLASSNAME, theme }))}
            style={aspectRatio === AspectRatios.original ? {} : style}
            {...props}
        >
            {aspectRatio === AspectRatios.original && <img src={image} alt={alt} />}
        </div>
    );
};
Thumbnail.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, AspectRatio, AspectRatios, Thumbnail, ThumbnailProps, Theme, Themes };
