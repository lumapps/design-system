import React, { ReactNode, Ref } from 'react';

import classNames from 'classnames';

import { Avatar, Orientation, Size, Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Authorized size values.
 */
export type UserBlockSize = Size.s | Size.m | Size.l;

/**
 * Defines the props of the component.
 */
export interface UserBlockProps extends GenericProps {
    /** Avatar image. */
    avatar?: string;
    /** Simple Action block. */
    simpleAction?: ReactNode;
    /** Multiple Actions block. */
    multipleActions?: ReactNode;
    /** Additional fields used to describe the use. */
    fields?: string[];
    /** User name. */
    name?: string;
    /** Orientation. */
    orientation?: Orientation;
    /** Size. */
    size?: UserBlockSize;
    /** Theme. */
    theme?: Theme;
    /** Reference passed to the wrapper. */
    userBlockRef?: Ref<HTMLDivElement>;
    /** Callback for the click event. */
    onClick?(): void;
    /** Callback for the mouseEnter event. */
    onMouseEnter?(): void;
    /** Callback for the mouseEnter event. */
    onMouseLeave?(): void;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}UserBlock`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<UserBlockProps> = {
    orientation: Orientation.horizontal,
    size: Size.m,
    theme: Theme.light,
};

/**
 * Render a user information as a card if orientation is vertical or no action user info block if horizontal.
 *
 * @return The component.
 */
export const UserBlock: React.FC<UserBlockProps> = ({
    avatar,
    theme = DEFAULT_PROPS.theme,
    orientation = DEFAULT_PROPS.orientation,
    fields,
    name,
    onClick,
    onMouseEnter,
    onMouseLeave,
    className,
    simpleAction,
    multipleActions,
    size = DEFAULT_PROPS.size,
    userBlockRef,
}) => {
    // Special case - When using vertical orientation force the size to be Sizes.l.
    const componentSize: UserBlockSize = orientation === Orientation.vertical ? Size.l : (size as UserBlockSize);
    const shouldDisplayActions = orientation === Orientation.vertical;

    const nameBlock: ReactNode = name && (
        <span className={`${CLASSNAME}__name`} onClick={onClick} tabIndex={onClick ? 0 : -1}>
            {name}
        </span>
    );

    const fieldsBlock: ReactNode = fields && componentSize !== Size.s && (
        <div className={`${CLASSNAME}__fields`}>
            {fields.map((field, idx) => (
                <span key={`ubf${idx}`} className={`${CLASSNAME}__field`}>
                    {field}
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
