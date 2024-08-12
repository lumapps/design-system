import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { Avatar, ColorPalette, Link, Orientation, Size, Theme } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/core/js/utils/className';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { AvatarProps } from '../avatar/Avatar';

/**
 * User block sizes.
 */
export type UserBlockSize = Extract<Size, 'xs' | 's' | 'm' | 'l'>;

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
    name?: React.ReactNode;
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
    /** Display additional fields below the original name and fields */
    additionalFields?: React.ReactNode;
    /** Display an additional element after the entire component. (to the right if orientation is horizontal, at the bottom if orientation is vertical) */
    after?: React.ReactNode;
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
};

/**
 * UserBlock component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const UserBlock = forwardRef<UserBlockProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
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
        orientation = DEFAULT_PROPS.orientation,
        simpleAction,
        size = DEFAULT_PROPS.size,
        theme = defaultTheme,
        children,
        additionalFields,
        after,
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
        if (!name) {
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
        return <NameComponent {...nProps}>{name}</NameComponent>;
    }, [isClickable, linkAs, linkProps, name, nameProps, onClick]);

    const shouldDisplayFields = componentSize !== Size.s && componentSize !== Size.xs;

    const fieldsBlock: ReactNode = fields && shouldDisplayFields && (
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
                    thumbnailProps={{
                        ...avatarProps?.thumbnailProps,
                        // Disable avatar focus since the name block is the same link / same button.
                        tabIndex: avatarProps ? -1 : undefined,
                    }}
                />
            )}
            {(fields || name || children || additionalFields) && (
                <div className={`${CLASSNAME}__wrapper`}>
                    {children || nameBlock}
                    {fieldsBlock}
                    {shouldDisplayFields ? additionalFields : null}
                </div>
            )}
            {shouldDisplayActions && simpleAction && <div className={`${CLASSNAME}__action`}>{simpleAction}</div>}
            {shouldDisplayActions && multipleActions && (
                <div className={`${CLASSNAME}__actions`}>{multipleActions}</div>
            )}
            {after ? <div className={`${CLASSNAME}__after`}>{after}</div> : null}
        </div>
    );
});
UserBlock.displayName = COMPONENT_NAME;
UserBlock.className = CLASSNAME;
UserBlock.defaultProps = DEFAULT_PROPS;
