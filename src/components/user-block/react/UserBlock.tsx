import React from 'react';

import classNames from 'classnames';

import { Orientation, Orientations, Theme, Themes } from 'LumX/components';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { ThumbnailVariants } from 'LumX';
import { Thumbnail } from 'LumX/components/thumbnail/react/Thumbnail';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/**
 * Authorized size values.
 */
enum Sizes {
    s = 's',
    m = 'm',
    l = 'l',
}
type Size = Sizes;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IUserBlockProps extends IGenericProps {
    /* Avatar image. */
    avatar?: string;
    /* Simple Action block. */
    simpleAction?: React.ReactNode;
    /* Multiple Actions block. */
    multipleActions?: React.ReactNode;
    /* Additionnal fields used to describe the use. */
    fields?: string[];
    /* User name. */
    name?: string;
    /* Orientation. */
    orientation?: Orientation;
    /* Size. */
    size?: Size;
    /* Theme. */
    theme?: Theme;
    /* Callback for the click event. */
    onClick?(): void;
    /* Callback for the mouseEnter event. */
    onMouseEnter?(): void;
    /* Callback for the mouseEnter event. */
    onMouseLeave?(): void;
}
type UserBlockProps = IUserBlockProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<UserBlockProps> {}

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
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}UserBlock`;

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
    orientation: Orientations.horizontal,
    size: Sizes.m,
    theme: Themes.light,
};
/////////////////////////////

/**
 * Render a user information as a card if orientation is vertical or no action user info block if horizontal.
 *
 * @return {React.ReactElement} The component.
 */
const UserBlock: React.FC<IUserBlockProps> = ({
    avatar,
    theme = DEFAULT_PROPS.theme,
    orientation = DEFAULT_PROPS.orientation,
    fields,
    name,
    onClick,
    onMouseEnter,
    onMouseLeave,
    className = '',
    simpleAction,
    multipleActions,
    size = DEFAULT_PROPS.size,
}: IUserBlockProps): React.ReactElement => {
    let componentSize: Sizes | undefined = size;

    // Special case - When using vertical orientation force the size to be Sizes.l.
    if (orientation === Orientations.vertical) {
        componentSize = Sizes.l;
    }

    const shouldDisplayActions: boolean = orientation === Orientations.vertical;

    const nameBlock: React.ReactNode = name && (
        <span
            className={`${CLASSNAME}__name`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            tabIndex={onClick ? 0 : -1}
        >
            {name}
        </span>
    );

    const fieldsBlock: React.ReactNode = fields && componentSize !== Sizes.s && (
        <div className={`${CLASSNAME}__fields`}>
            {fields.map((aField: string, idx: number) => (
                <span key={`ubf${idx}`} className={`${CLASSNAME}__field`}>
                    {aField}
                </span>
            ))}
        </div>
    );

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, orientation, size: componentSize, theme }),
            )}
        >
            {avatar && (
                <div className={`${CLASSNAME}__avatar`}>
                    <Thumbnail
                        image={avatar}
                        size={componentSize}
                        variant={ThumbnailVariants.rounded}
                        onMouseLeave={onMouseLeave}
                        onMouseEnter={onMouseEnter}
                        onClick={onClick}
                        tabIndex={onClick ? 0 : -1}
                        theme={theme}
                    />
                </div>
            )}
            {(fields || name) && (
                <div className={`${CLASSNAME}__wrapper`}>
                    {nameBlock}
                    {fieldsBlock}
                </div>
            )}
            {shouldDisplayActions && simpleAction && <div className={`${CLASSNAME}__action`}>{simpleAction}</div>}
            {shouldDisplayActions && multipleActions && (
                <div className={`${CLASSNAME}__actions`}>{multipleActions}</div>
            )}
        </div>
    );
};
UserBlock.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, UserBlock, UserBlockProps, Sizes, Theme, Themes };
