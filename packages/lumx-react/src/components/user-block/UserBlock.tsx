import React, { ReactElement, ReactNode, Ref } from 'react';

import classNames from 'classnames';

import { Avatar, Orientation, Size, Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Authorized size values.
 */
type UserBlockSize = Size.s | Size.m | Size.l;

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IUserBlockProps extends IGenericProps {
    /* Avatar image. */
    avatar?: string;
    /* Simple Action block. */
    simpleAction?: ReactNode;
    /* Multiple Actions block. */
    multipleActions?: ReactNode;
    /* Additionnal fields used to describe the use. */
    fields?: string[];
    /* User name. */
    name?: string;
    /* Orientation. */
    orientation?: Orientation;
    /* Size. */
    size?: UserBlockSize;
    /* Theme. */
    theme?: Theme;
    /* Reference passed to the wrapper. */
    userBlockRef?: Ref<HTMLDivElement>;
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
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}UserBlock`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    orientation: Orientation.horizontal,
    size: Size.m,
    theme: Theme.light,
};
/////////////////////////////

/**
 * Render a user information as a card if orientation is vertical or no action user info block if horizontal.
 *
 * @return The component.
 */
const UserBlock = ({
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
    userBlockRef,
}: IUserBlockProps): ReactElement => {
    let componentSize = size;

    // Special case - When using vertical orientation force the size to be Sizes.l.
    if (orientation === Orientation.vertical) {
        componentSize = Size.l;
    }

    const shouldDisplayActions: boolean = orientation === Orientation.vertical;

    const nameBlock: ReactNode = name && (
        <span className={`${CLASSNAME}__name`} onClick={onClick} tabIndex={onClick ? 0 : -1}>
            {name}
        </span>
    );

    const fieldsBlock: ReactNode = fields && componentSize !== Size.s && (
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
            ref={userBlockRef}
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, orientation, size: componentSize, theme }),
            )}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
        >
            {avatar && (
                <div className={`${CLASSNAME}__avatar`}>
                    <Avatar
                        image={avatar}
                        size={componentSize}
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

export { CLASSNAME, DEFAULT_PROPS, UserBlock, UserBlockProps, UserBlockSize };
