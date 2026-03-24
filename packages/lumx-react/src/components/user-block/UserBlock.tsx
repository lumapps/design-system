import React, { ReactNode } from 'react';

import { Avatar, Theme, Text, Link, ColorPalette } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import {
    UserBlock as UI,
    UserBlockProps as UIProps,
    UserBlockPropsToOverride,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    element,
    isUserBlockClickeable,
    UserBlockSize,
} from '@lumx/core/js/components/UserBlock';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import { classNames } from '@lumx/core/js/utils';
import { AvatarProps } from '../avatar/Avatar';

export type { UserBlockSize };

/**
 * Defines the props of the component.
 */
export interface UserBlockProps extends GenericProps, ReactToJSX<UIProps, UserBlockPropsToOverride> {
    /** Props to pass to the avatar. */
    avatarProps?: Omit<AvatarProps, 'alt'>;
    /** Props to pass to the link wrapping the avatar thumbnail. */
    linkProps?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    /** On click callback. */
    onClick?(): void;
    /** On mouse enter callback. */
    onMouseEnter?(): void;
    /** On mouse leave callback. */
    onMouseLeave?(): void;
}

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
        onClick,
        onMouseEnter,
        onMouseLeave,
        theme = defaultTheme,
        nameProps,
        avatarProps,
        name,
        linkProps,
        linkAs,
        children,
        ...forwardedProps
    } = props;

    const isClickable = isUserBlockClickeable({ linkAs, linkProps, handleClick: onClick });

    /**
     * This logic needs to occur on the wrapper level, since core templates cannot manage
     * the render of dynamically determined components. So `NameComponent`, if moved to core,
     * it will return an `undefined`
     */
    const nameBlock: ReactNode = React.useMemo(() => {
        if (isEmpty(name)) {
            return null;
        }
        let NameComponent: any = 'span';
        const nProps: any = {
            ...nameProps,
            className: classNames.join(element('name'), linkProps?.className, nameProps?.className),
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
        return (
            <NameComponent {...nProps}>
                <Text as="span">{name}</Text>
            </NameComponent>
        );
    }, [avatarProps, isClickable, linkAs, linkProps, name, nameProps, onClick]);

    return UI({
        Avatar,
        ref,
        Text,
        handleClick: onClick,
        handleMouseEnter: onMouseEnter,
        handleMouseLeave: onMouseLeave,
        theme,
        nameProps,
        avatarProps,
        name,
        linkProps,
        linkAs,
        ...forwardedProps,
        children: children || nameBlock,
    });
});

UserBlock.displayName = COMPONENT_NAME;
UserBlock.className = CLASSNAME;
UserBlock.defaultProps = DEFAULT_PROPS;
