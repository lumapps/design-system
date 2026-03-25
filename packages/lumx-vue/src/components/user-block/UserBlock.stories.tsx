import { Badge, Icon, IconButton, Link, Text, UserBlock } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withResizableBox } from '@lumx/vue/stories/decorators/withResizableBox';
import { setup } from '@lumx/core/js/components/UserBlock/Stories';

const { meta, ...stories } = setup({
    component: UserBlock,
    components: { Text, Icon, IconButton, Badge, Link },
    decorators: { withCombinations },
    render: ({ simpleAction, multipleActions, additionalFields, after, ...args }: any) => (
        <UserBlock {...args}>
            {{
                'simple-action': simpleAction ? () => simpleAction : undefined,
                'multiple-actions': multipleActions ? () => multipleActions : undefined,
                'additional-fields': additionalFields ? () => additionalFields : undefined,
                after: after ? () => after : undefined,
            }}
        </UserBlock>
    ),
});

export default {
    title: 'LumX components/user-block/UserBlock',
    ...meta,
    decorators: [withResizableBox({ width: 'auto', height: 'auto' })],
};

export const AvatarOnly = { ...stories.AvatarOnly };
export const AvatarAndName = { ...stories.AvatarAndName };
export const AvatarAndCustomName = { ...stories.AvatarAndCustomName };
export const AvatarAndNameAndSecondaryFields = { ...stories.AvatarAndNameAndSecondaryFields };
export const WithAfter = { ...stories.WithAfter };
export const WithAdditionalFields = { ...stories.WithAdditionalFields };
export const SizesAndOrientations = { ...stories.SizesAndOrientations };
export const WithConstrainedSize = { ...stories.WithConstrainedSize };
export const AsButton = {
    ...stories.AsButton,
    argTypes: { onClick: { action: true } },
};
export const AsLink = { ...stories.AsLink };
export const WithBadge = { ...stories.WithBadge };
