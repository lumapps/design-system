import { mdiDelete, mdiEye, mdiPencil, mdiStar } from '@lumx/icons';
import { Avatar, Badge, ColorPalette, FlexBox, Icon, IconButton, Size } from '@lumx/vue';
import { colorArgType } from '@lumx/core/stories/controls/color';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withNestedProps } from '@lumx/vue/stories/decorators/withNestedProps';
import { setup } from '@lumx/core/js/components/Avatar/Stories';

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
 * Avatar with actions
 */
export const WithActions = {
    args: { size: Size.xl },
    render: (args: any) => (
        <Avatar {...args}>
            {{
                actions: () => (
                    <FlexBox orientation="horizontal" gap="regular" verticalAlign="center">
                        <IconButton label="Edit" emphasis="low" hasBackground icon={mdiPencil} size="s" />
                        <IconButton label="See" emphasis="low" hasBackground icon={mdiEye} size="s" />
                        <IconButton label="Delete" emphasis="low" hasBackground icon={mdiDelete} size="s" />
                    </FlexBox>
                ),
            }}
        </Avatar>
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
        <Avatar {...props}>
            {{
                badge: () => (
                    <Badge color={badge.color}>
                        <Icon icon={badge.icon} />
                    </Badge>
                ),
            }}
        </Avatar>
    ),
};
