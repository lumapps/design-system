import { mdiDelete, mdiEye, mdiPencil, mdiStar } from '@lumx/icons';
import { AvatarSize, Badge, ColorPalette, Emphasis, Icon, IconButton, Size } from '@lumx/react';
import { AVATAR_IMAGES, avatarImageKnob, PORTRAIT_IMAGES } from '@lumx/react/stories/knobs';
import { select } from '@storybook/addon-knobs';
import React from 'react';

import { Avatar } from './Avatar';

export default { title: 'LumX components/avatar/Avatar' };

const AVATAR_SIZES: AvatarSize[] = [Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];

/**
 * Avatar stories showing a simple Avatar with different sizes.
 * @return component with different sizes.
 */
export const AvatarSizes = () =>
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
export const AvatarWithActions = () =>
    AVATAR_SIZES.map((size) => (
        <Avatar
            key={size}
            image={avatarImageKnob('Avatar', AVATAR_IMAGES.avatar2)}
            alt={size}
            size={size}
            actions={
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="lumx-spacing-margin-right-regular">
                        <IconButton
                            label="Edit"
                            color="dark"
                            emphasis={Emphasis.low}
                            hasBackground
                            icon={mdiPencil}
                            size={Size.s}
                        />
                    </div>

                    <div className="lumx-spacing-margin-right-regular">
                        <IconButton
                            label="See"
                            color="dark"
                            emphasis={Emphasis.low}
                            hasBackground
                            icon={mdiEye}
                            size={Size.s}
                        />
                    </div>

                    <div>
                        <IconButton
                            label="Delete"
                            color="dark"
                            emphasis={Emphasis.low}
                            hasBackground
                            icon={mdiDelete}
                            size={Size.s}
                        />
                    </div>
                </div>
            }
        />
    ));

export const AvatarWithBadge = () =>
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

export const AvatarWithRectangularImage = () =>
    AVATAR_SIZES.map((size) => (
        <Avatar
            key={size}
            className="lumx-spacing-margin-bottom"
            image={PORTRAIT_IMAGES.portrait3}
            alt={size}
            size={size}
        />
    ));

export const AvatarClickable = () =>
    AVATAR_SIZES.map((size) => (
        <Avatar
            key={size}
            className="lumx-spacing-margin-bottom"
            image={AVATAR_IMAGES.avatar2}
            alt={size}
            size={size}
            onClick={() => alert('clicked on avatar')}
        />
    ));
