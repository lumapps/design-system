/* eslint-disable react/display-name */
import React from 'react';

import { mdiDelete, mdiEye, mdiPencil, mdiStar } from '@lumx/icons';
import { AvatarSize, Badge, ColorPalette, FlexBox, Icon, IconButton, Size } from '@lumx/react';
import { avatarImageArgType, AVATAR_IMAGES } from '@lumx/react/stories/controls/image';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';

import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { colorArgType } from '@lumx/react/stories/controls/color';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { iconArgType } from '@lumx/react/stories/controls/icons';
import { Avatar } from './Avatar';

const AVATAR_SIZES = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];

export default {
    title: 'LumX components/avatar/Avatar',
    component: Avatar,
    argTypes: {
        image: avatarImageArgType,
        size: getSelectArgType<AvatarSize>(AVATAR_SIZES),
    },
    args: { image: AVATAR_IMAGES.avatar1 },
};

/**
 * Default avatar
 */
export const Default = {};

/**
 * Having onClick transforming the avatar into a button
 */
export const AvatarButton = {
    argTypes: {
        onClick: { action: true },
    },
};

/**
 * Having href transforming the avatar into a link
 */
export const AvatarLink = {
    args: {
        href: 'https://example.com',
        target: '_blank',
    },
};

/**
 * Having linkAs transforming the avatar into a custom link
 */
export const AvatarCustomLink = {
    args: {
        linkAs: CustomLink,
    },
};

/**
 * Avatar with actions
 */
export const WithActions = {
    args: { size: Size.xl },
    render: (props: any) => (
        <Avatar
            {...props}
            actions={
                <FlexBox orientation="horizontal" gap="regular" vAlign="center">
                    <IconButton label="Edit" emphasis="low" hasBackground icon={mdiPencil} size="s" />
                    <IconButton label="See" emphasis="low" hasBackground icon={mdiEye} size="s" />
                    <IconButton label="Delete" emphasis="low" hasBackground icon={mdiDelete} size="s" />
                </FlexBox>
            }
        />
    ),
};

/**
 * All sizes
 */
export const AllSizes = {
    argTypes: {
        size: { control: false },
    },
    decorators: [
        withCombinations({
            combinations: {
                cols: { key: 'size', options: AVATAR_SIZES },
            },
        }),
    ],
};

/**
 * All sizes with badge
 */
export const AllSizesWithBadge = {
    ...AllSizes,
    args: {
        'badge.color': ColorPalette.blue,
        'badge.icon': mdiStar,
    },
    argTypes: {
        ...AllSizes.argTypes,
        'badge.color': colorArgType,
        'badge.icon': iconArgType,
    },
    decorators: [...AllSizes.decorators, withNestedProps()],
    render: ({ badge, ...props }: any) => (
        <Avatar
            {...(props as any)}
            badge={
                <Badge color={badge.color}>
                    <Icon icon={badge.icon} />
                </Badge>
            }
        />
    ),
};
