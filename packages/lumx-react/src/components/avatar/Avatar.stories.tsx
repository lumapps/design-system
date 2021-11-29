import React from 'react';
import { select } from '@storybook/addon-knobs';

import { mdiDelete, mdiEye, mdiPencil, mdiStar } from '@lumx/icons';
import { Badge, ColorPalette, FlexBox, Icon, IconButton, Size } from '@lumx/react';
import { AVATAR_IMAGES, avatarImageKnob, PORTRAIT_IMAGES } from '@lumx/react/stories/knobs/image';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';

import { Avatar } from './Avatar';

export default { title: 'LumX components/avatar/Avatar' };

const AVATAR_SIZES = [Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];

/**
 * Avatar stories showing a simple Avatar with different sizes.
 * @return component with different sizes.
 */
export const Sizes = () =>
    AVATAR_SIZES.map((size) => (
        <Avatar
            key={size}
            className="lumx-spacing-margin-bottom"
            image={avatarImageKnob('Avatar', AVATAR_IMAGES.avatar1)}
            alt={size}
            size={size}
        />
    ));

/**
 * Avatar story showing a simple avatar with different actions.
 * @return component with different actions.
 */
export const WithActions = () =>
    AVATAR_SIZES.map((size) => (
        <Avatar
            key={size}
            image={avatarImageKnob('Avatar', AVATAR_IMAGES.avatar2)}
            alt={size}
            size={size}
            actions={
                <FlexBox orientation="horizontal" gap="regular" vAlign="center">
                    <IconButton label="Edit" emphasis="low" hasBackground icon={mdiPencil} size="s" />
                    <IconButton label="See" emphasis="low" hasBackground icon={mdiEye} size="s" />
                    <IconButton label="Delete" emphasis="low" hasBackground icon={mdiDelete} size="s" />
                </FlexBox>
            }
        />
    ));

export const WithBadge = () =>
    AVATAR_SIZES.map((size) => (
        <Avatar
            key={size}
            className="lumx-spacing-margin-bottom"
            image={avatarImageKnob('Avatar', AVATAR_IMAGES.avatar3)}
            alt={size}
            badge={
                <Badge color={select('Colors', ColorPalette, ColorPalette.blue)}>
                    <Icon icon={mdiStar} />
                </Badge>
            }
            size={size}
        />
    ));

export const WithRectangularImage = () =>
    AVATAR_SIZES.map((size) => (
        <Avatar
            key={size}
            className="lumx-spacing-margin-bottom"
            image={PORTRAIT_IMAGES.portrait3}
            alt={size}
            size={size}
        />
    ));

export const Clickable = () => {
    const baseProps = { size: 'l', image: AVATAR_IMAGES.avatar2, alt: 'avatar2' } as any;
    return (
        <>
            <p>As a button</p>
            <Avatar {...baseProps} onClick={() => alert('clicked on avatar')} />

            <p>As a link</p>
            <Avatar {...baseProps} linkProps={{ href: 'https://example.com' }} />

            <p>As a custom link component</p>
            <Avatar {...baseProps} linkAs={CustomLink} />
        </>
    );
};
