/* eslint-disable react/display-name */
import { mdiDelete, mdiEye, mdiPencil, mdiStar } from '@lumx/icons';
import { Badge, ColorPalette, FlexBox, Icon, IconButton, Size } from '@lumx/react';
import { colorArgType } from '@lumx/core/stories/controls/color';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';
import { setup } from '@lumx/core/js/components/Avatar/Stories';

import { Avatar } from './Avatar';

const { meta, ...stories } = setup({
    component: Avatar,
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/avatar/Avatar',
    ...meta,
};

export const Default = { ...stories.Default };
export const AvatarButton = { ...stories.AvatarButton };
export const AvatarLink = { ...stories.AvatarLink };
export const AllSizes = { ...stories.AllSizes };

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
 * All sizes with badge
 */
export const AllSizesWithBadge = {
    ...stories.AllSizes,
    args: {
        'badge.color': ColorPalette.blue,
        'badge.icon': mdiStar,
    },
    argTypes: {
        ...stories.AllSizes.argTypes,
        'badge.color': colorArgType,
        'badge.icon': iconArgType,
    },
    decorators: [...stories.AllSizes.decorators, withNestedProps()],
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
