import React, { CSSProperties } from 'react';

import classNames from 'classnames';

import { Theme, Themes } from 'LumX/components';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/**
 * Authorized size values.
 */
enum Sizes {
    xxs = 'xxs',
    xs = 'xs',
    s = 's',
    m = 'm',
    l = 'l',
    xl = 'xl',
}
type Size = Sizes;

/**
 * Authorized variants.
 */
enum Variants {
    squared = 'squared',
    rounded = 'rounded',
}
type Variant = Variants;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IThumbnailProps extends IGenericProps {
    /* Size. */
    size?: Size;
    /* Variant. */
    variant?: Variant;
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
    size: Sizes.m,
    theme: Themes.light,
    variant: Variants.squared,
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
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
    variant = DEFAULT_PROPS.variant,
    image,
    ...props
}: ThumbnailProps): React.ReactElement => {
    const style: CSSProperties = {
        backgroundImage: `url(${image})`,
    };
    return (
        <div
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, size, variant, theme }))}
            {...props}
            style={style}
        />
    );
};
Thumbnail.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Thumbnail, ThumbnailProps, Theme, Themes, Sizes, Variants };
