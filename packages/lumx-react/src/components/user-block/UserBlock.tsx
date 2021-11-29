import React, { forwardRef, ReactNode } from 'react';

import classNames from 'classnames';

import { Avatar, Orientation, Size, Theme } from '@lumx/react';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { isEmpty } from 'lodash';
import { renderLink } from '@lumx/react/utils/renderLink';
import { AvatarProps } from '../avatar/Avatar';

/**
 * User block sizes.
 */
export type UserBlockSize = Extract<Size, 's' | 'm' | 'l'>;

/**
 * Defines the props of the component.
 */
export interface UserBlockProps extends GenericProps {
    /** Props to pass to the avatar. */
    avatarProps?: AvatarProps;
    /** Props to pass to the link wrapping the avatar thumbnail. */
    linkProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** Simple action toolbar content. */
    simpleAction?: ReactNode;
    /** Multiple action toolbar content. */
    multipleActions?: ReactNode;
    /** Additional fields used to describe the user. */
    fields?: string[];
    /** User name. */
    name?: string;
    /** Orientation. */
    orientation?: Orientation;
    /** Size variant. */
    size?: UserBlockSize;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
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
        multipleActions,
        name,
        onClick,
        onMouseEnter,
        onMouseLeave,
        orientation,
        simpleAction,
        size,
        theme,
        linkProps,
        linkAs,
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
        const nameClassName = classNames(
            handleBasicClasses({ prefix: `${CLASSNAME}__name`, isClickable }),
            isLink && linkProps?.className,
        );
        if (isLink) {
            return renderLink({ ...linkProps, linkAs, className: nameClassName }, name);
        }
        if (onClick) {
            return (
                <button onClick={onClick} type="button" className={nameClassName}>
                    {name}
                </button>
            );
        }
        return <span className={nameClassName}>{name}</span>;
    }, [isClickable, isLink, linkAs, linkProps, name, onClick]);

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
                    linkProps={linkProps}
                    {...avatarProps}
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
