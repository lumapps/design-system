import React, { forwardRef, ReactNode } from 'react';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import set from 'lodash/set';

import { Avatar, ColorPalette, Link, Orientation, Size, Theme } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses, HasTheme } from '@lumx/react/utils';

import { AvatarProps } from '../avatar/Avatar';

/**
 * User block sizes.
 */
export type UserBlockSize = Extract<Size, 's' | 'm' | 'l'>;

/**
 * Defines the props of the component.
 */
export interface UserBlockProps extends GenericProps, HasTheme {
    /** Props to pass to the avatar. */
    avatarProps?: Omit<AvatarProps, 'alt'>;
    /** Additional fields used to describe the user. */
    fields?: string[];
    /** Props to pass to the link wrapping the avatar thumbnail. */
    linkProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** Multiple action toolbar content. */
    multipleActions?: ReactNode;
    /** User name. */
    name?: string;
    /** Props to pass to the name block. */
    nameProps?: GenericProps;
    /** Orientation. */
    orientation?: Orientation;
    /** Simple action toolbar content. */
    simpleAction?: ReactNode;
    /** Size variant. */
    size?: UserBlockSize;
    /** On click callback. */
    onClick?(): void;
    /** On mouse enter callback. */
    onMouseEnter?(): void;
    /** On mouse leave callback. */
    onMouseLeave?(): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'UserBlock';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<UserBlockProps> = {
    orientation: Orientation.horizontal,
    size: Size.m,
    theme: Theme.light,
};

/**
 * UserBlock component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const UserBlock: Comp<UserBlockProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        avatarProps,
        className,
        fields,
        linkProps,
        linkAs,
        multipleActions,
        name,
        nameProps,
        onClick,
        onMouseEnter,
        onMouseLeave,
        orientation,
        simpleAction,
        size,
        theme,
        ...forwardedProps
    } = props;
    let componentSize = size;

    // Special case - When using vertical orientation force the size to be Sizes.l.
    if (orientation === Orientation.vertical) {
        componentSize = Size.l;
    }

    const shouldDisplayActions: boolean = orientation === Orientation.vertical;

    const isLink = Boolean(linkProps?.href || linkAs);
    const isClickable = !!onClick || isLink;

    const nameBlock: ReactNode = React.useMemo(() => {
        if (isEmpty(name)) {
            return null;
        }
        let NameComponent: any = 'span';
        const nProps: any = {
            ...nameProps,
            className: classNames(`${CLASSNAME}__name`, linkProps?.className, nameProps?.className),
        };
        if (isClickable) {
            NameComponent = Link;
            Object.assign(nProps, {
                ...linkProps,
                onClick,
                linkAs,
                color: ColorPalette.dark,
            });
        }
        // Disable avatar focus since the name block is the same link / same button.
        if (avatarProps) {
            set(avatarProps, ['thumbnailProps', 'tabIndex'], -1);
        }
        return <NameComponent {...nProps}>{name}</NameComponent>;
    }, [avatarProps, isClickable, linkAs, linkProps, name, nameProps, onClick]);

    const fieldsBlock: ReactNode = fields && componentSize !== Size.s && (
        <div className={`${CLASSNAME}__fields`}>
            {fields.map((field: string, idx: number) => (
                <span key={idx} className={`${CLASSNAME}__field`}>
                    {field}
                </span>
            ))}
        </div>
    );

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, orientation, size: componentSize, theme, isClickable }),
            )}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
        >
            {avatarProps && (
                <Avatar
                    linkAs={linkAs}
                    linkProps={linkProps}
                    alt=""
                    {...(avatarProps as any)}
                    className={classNames(`${CLASSNAME}__avatar`, avatarProps.className)}
                    size={componentSize}
                    onClick={onClick}
                    theme={theme}
                />
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
});
UserBlock.displayName = COMPONENT_NAME;
UserBlock.className = CLASSNAME;
UserBlock.defaultProps = DEFAULT_PROPS;
