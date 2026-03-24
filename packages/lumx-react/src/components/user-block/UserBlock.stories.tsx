import { Badge, Icon, IconButton, Link, Text } from '@lumx/react';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withResizableBox } from '@lumx/react/stories/decorators/withResizableBox';
import { setup } from '@lumx/core/js/components/UserBlock/Stories';
import { UserBlock } from './UserBlock';

const { meta, ...stories } = setup({
    component: UserBlock,
    components: { Text, Icon, IconButton, Badge, Link },
    decorators: { withCombinations },
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
export const WithAdditionalFields = {
    ...stories.WithAdditionalFields,
    parameters: {
        wrapperProps: { style: { width: 245 } },
    },
};
export const SizesAndOrientations = { ...stories.SizesAndOrientations };
export const WithConstrainedSize = {
    ...stories.WithConstrainedSize,
    parameters: {
        wrapperProps: { style: { width: 150, resize: 'horizontal' } },
    },
};
export const AsButton = {
    ...stories.AsButton,
    argTypes: { onClick: { action: true } },
};
export const AsLink = { ...stories.AsLink };
export const WithBadge = { ...stories.WithBadge };

/** Setting the `linkAs` prop to inject a custom link component */
export const AsCustomLink = {
    args: {
        ...AvatarAndNameAndSecondaryFields.args,
        linkAs: CustomLink,
    },
};
