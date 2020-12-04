import React, { ReactNode, Ref } from 'react';

import classNames from 'classnames';

import { Avatar, Orientation, Size, Theme } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { AvatarProps } from '../avatar/Avatar';

/**
 * Authorized size values.
 */
export type UserBlockSize = Size.s | Size.m | Size.l;

/**
 * Defines the props of the component.
 */
export interface UserBlockProps extends GenericProps {
    /**
     * The url of the avatar picture we want to display.
     * @see {@link AvatarProps#image}
     */
    avatar?: string;
    /** The props to pass to the avatar, minus those already set by the UserBlock props. */
    avatarProps?: Omit<AvatarProps, 'image' | 'size' | 'onClick' | 'tabIndex' | 'theme'>;
    /** The single action element. */
    simpleAction?: ReactNode;
    /** The group of action elements. */
    multipleActions?: ReactNode;
    /** The additional fields used to describe the user. */
    fields?: string[];
    /** The name of the user.. */
    name?: string;
    /** The orientation of the user block. */
    orientation?: Orientation;
    /** The size variant of the component. */
    size?: UserBlockSize;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** The reference passed to the wrapper. */
    userBlockRef?: Ref<HTMLDivElement>;
    /** The function called on click. */
    onClick?(): void;
    /** The function called when the cursor enters the component. */
    onMouseEnter?(): void;
    /** The function called when the cursor exits the component. */
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
const DEFAULT_PROPS: Partial<UserBlockProps> = {
    orientation: Orientation.horizontal,
    size: Size.m,
    theme: Theme.light,
};

export const UserBlock: React.FC<UserBlockProps> = ({
    avatar,
    avatarProps,
    className,
    fields,
    multipleActions,
    name,
    onClick,
    onMouseEnter,
    onMouseLeave,
    orientation,
    simpleAction,
    size,
    theme,
    userBlockRef,
    ...forwardedProps
}) => {
    let componentSize = size;

    // Special case - When using vertical orientation force the size to be Sizes.l.
    if (orientation === Orientation.vertical) {
        componentSize = Size.l;
    }

    const shouldDisplayActions: boolean = orientation === Orientation.vertical;

    const nameBlock: ReactNode = name && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-tabindex,jsx-a11y/no-static-element-interactions
        <span className={`${CLASSNAME}__name`} onClick={onClick} tabIndex={onClick ? 0 : -1}>
            {name}
        </span>
    );

    const fieldsBlock: ReactNode = fields && componentSize !== Size.s && (
        <div className={`${CLASSNAME}__fields`}>
            {fields.map((aField: string, idx: number) => (
                <span key={idx} className={`${CLASSNAME}__field`}>
                    {aField}
                </span>
            ))}
        </div>
    );

    return (
        <div
            {...forwardedProps}
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
                        {...avatarProps}
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
UserBlock.defaultProps = DEFAULT_PROPS;
