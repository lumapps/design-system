import React, { forwardRef, ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import { Size, Theme, Thumbnail, ThumbnailProps } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Avatar sizes.
 */
export type AvatarSize = Extract<Size, 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'>;

/**
 * Defines the props of the component.
 */
export interface AvatarProps extends GenericProps {
    /** Action toolbar content. */
    actions?: ReactNode;
    /** Image alternative text. */
    alt: string;
    /** Badge. */
    badge?: ReactElement;
    /** Image URL. */
    image: string;
    /** Size variant. */
    size?: AvatarSize;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Props to pass to the thumbnail (minus those already set by the Avatar props). */
    thumbnailProps?: Omit<ThumbnailProps, 'image' | 'alt' | 'size' | 'theme' | 'align' | 'fillHeight' | 'variant'>;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Avatar`;

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<AvatarProps> = {
    size: Size.m,
    theme: Theme.light,
};

/**
 * Avatar component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Avatar: Comp<AvatarProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { actions, alt, badge, className, image, size, theme, thumbnailProps, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, size, theme }))}
        >
            <Thumbnail {...thumbnailProps} image={image} alt={alt} />
            {actions && <div className={`${CLASSNAME}__actions`}>{actions}</div>}
            {badge && <div className={`${CLASSNAME}__badge`}>{badge}</div>}
        </div>
    );
});
Avatar.displayName = COMPONENT_NAME;
Avatar.className = CLASSNAME;
Avatar.defaultProps = DEFAULT_PROPS;
